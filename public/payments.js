const STRIPE_PUBLIC_KEY = 'pk_test_SYvCp94MgvBxoYpj9Pss3xde00dqMVzpdx'; // Test key
       const FIREBASE_FUNCTION = 'https://us-central1-algorithmic-art.cloudfunctions.net/charge'; //

       const stripe = Stripe(STRIPE_PUBLIC_KEY);
       const elements = stripe.elements();

       const charge_amount = 300;
       const charge_currency = 'gbp';

       // Store the elements used
       const elForm = document.getElementById('form');
       const elCard = document.getElementById('card-element');
       const elError = document.getElementById('error');
       const elProcessing = document.getElementById('processing');
       const elThanks = document.getElementById('thanks');

       addCardMethod();

   function addCardMethod() {
           const card = elements.create('card');
           card.mount(elCard);
           // Create flags to help prevent duplicate submissions
           let isSubmitting, isSuccess;

           // Handle validation errors from the card element
           card.addEventListener('change', e => {
               if (e.error) {
                   elError.textContent = e.error.message;
               } else {
                   elError.textContent = '';
               }
           });

           elForm.addEventListener('submit', async e => {
               e.preventDefault();
               if (isSubmitting) return;
               isSubmitting = true;

               elForm.style.display = 'none';
               elProcessing.style.display = 'block';

               let result = await stripe.createToken(card);

               // Error in receiving token
               if (result.error) return elError.textContent = result.error.message;

               // Pass the received token to our Firebase function
               let res = await charge(result.token, charge_amount, charge_currency);
               if (res.body.error) return elError.textContent = res.body.error;
               // Card successfully charged
               card.clear();
               isSuccess = true;

               isSubmitting = false;
               elProcessing.style.display = 'none';

               // Either display thanks or re-display form if there was an error
               if (isSuccess) {
                   elThanks.style.display = 'block';
                   printPDF();
               } else {
                   elForm.style.display = 'block';
               }
           });
       }

       // Function used by all three methods to send the charge data to your Firebase function
       async function charge(token, amount, currency) {
           const res = await fetch(FIREBASE_FUNCTION, {
               method: 'POST',
               body: JSON.stringify({
                   token,
                   charge: {
                       amount,
                       currency,
                   },
               }),
           });
           const data = await res.json();
           data.body = JSON.parse(data.body);
           console.log(data);
           return data;
       }
