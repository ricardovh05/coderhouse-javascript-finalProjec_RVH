
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

// Agrega credenciales
mercadopago.configure({
  access_token: 'TEST-6320070074071204-032518-81406fc965f883ea6dae39fdb3200d71-204948993'
});

// Crea un objeto de preferencia
let preference = {
    items: [
      {
        title: 'Mi producto',
        unit_price: 100,
        quantity: 1,
      }
    ]
  };
  
  mercadopago.preferences.create(preference)
  .then(function(response){
  // Este valor reemplazará el string "<%= global.id %>" en tu HTML
    global.id = response.body.id;
  }).catch(function(error){
    console.log(error);
  });

const mp = new MercadoPago('TEST-31cce94b-b5b1-42cc-be59-e431c26eb7e8',{
locale: es-MX,
});
const checkout = mp.checkout({
    preference: {
        id: 'YOUR_PREFERENCE_ID'
    }
});
checkout.render({
    container: '.cho-container',
    label: 'Pay'
});