import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("Kiwify Webhook Received:", JSON.stringify(payload, null, 2));

    // Desestruturar informações chaves da Kiwify
    const { order_status, Customer, TrackingParameters, Product } = payload;

    // Se o pedido foi efetivamente pago / aprovado
    if (order_status === 'paid' || order_status === 'approved') {
      let uidToUpgrade = TrackingParameters?.src;

      // Se temos o User ID diretamente passado pelo 'src'
      if (uidToUpgrade) {
        console.log(`Upgrading UID passed via SRC: ${uidToUpgrade}`);
        await upgradeUserPlan(uidToUpgrade, Product?.product_name || 'Premium');
        return NextResponse.json({ success: true, message: 'User upgraded via SRC' });
      }

      // Fallback: Tentar encontrar o usuário pelo E-mail usado na compra
      const email = Customer?.email;
      if (email) {
        console.log(`No SRC found. Trying to find user by email: ${email}`);
        const usersRef = adminDb.collection('users');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          uidToUpgrade = userDoc.id;
          await upgradeUserPlan(uidToUpgrade, Product?.product_name || 'Premium');
          return NextResponse.json({ success: true, message: 'User upgraded via Email Match' });
        } else {
          console.log(`User with email ${email} not found in Database.`);
          return NextResponse.json({ success: false, message: 'User email not found' }, { status: 404 });
        }
      }

      return NextResponse.json({ success: false, message: 'No identifying parameter found (src/email)' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Ignored: Order status not approved' });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

async function upgradeUserPlan(uid: string, productName: string) {
  // Discover which plan it is based on Keyword in Product Name from Kiwify
  // We handle capitalization safely
  const productStr = productName.toLowerCase();
  
  let newPlan = 'gold'; // default assumption
  if (productStr.includes('iron')) newPlan = 'iron';
  if (productStr.includes('diamante') || productStr.includes('diamond')) newPlan = 'diamante';

  try {
    const userRef = adminDb.collection('users').doc(uid);
    await userRef.update({
      plan: newPlan,
      xp: FieldValue.increment(500) // Bonus XP for upgrading
    });
    console.log(`Success! Upgraded UID [${uid}] to Plan [${newPlan}]`);
  } catch (err) {
    console.error(`Failed to upgrade UID [${uid}]:`, err);
    throw err;
  }
}
