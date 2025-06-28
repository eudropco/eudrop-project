import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // --- SİPARİŞ VERİTABANI SİMÜLASYONU ---
    // Gelen sipariş detaylarını terminale yazdırarak backend'in çalıştığını görüyoruz.
    console.log('--- YENİ SİPARİŞ ALINDI ---');
    console.log('Ürün:', orderData.productName);
    console.log('Fiyat:', orderData.price);
    console.log('Sipariş Tipi:', orderData.orderType);
    if (orderData.orderType === 'upgrade') {
      console.log('Mevcut Kullanıcı Adı:', orderData.existingUsername);
      console.log('Mevcut Şifre:', orderData.existingPassword);
    }
    console.log('---------------------------');
    // --- SİMÜLASYON SONU ---

    return NextResponse.json({ message: 'Order received successfully! We will process it shortly.' }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}