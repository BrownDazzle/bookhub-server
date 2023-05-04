const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router()
const axios = require("axios")
const { v4: uuidv4 } = require('uuid');


router.post("/airtel", async (req, res) => {

  console.log("AirtelBody", req.body)

  /*const inputBody = {
    "client_id": "f9d413f8-d19b-4b76-8d7b-33a51ff048d6",
    "client_secret": "****************************",
    "grant_type": "client_credentials"
  };
  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*'
  };

  const respo = await axios({
    method: "post",
    url: 'https://openapiuat.airtel.africa/auth/oauth2/token',
    headers: headers,
    data: inputBody
  })
  const body = await respo.json()
  console.log(body)

   Airtel Payment Body    
  const inputBody = {
      "reference": "mnbvcxz",
      "subscriber": {
          "country": "ZM",
          "currency": "ZMW",
          "msisdn": 973302063
      },
      "transaction": {
          "amount": 1,
          "country": "ZM",
          "currency": "ZMW",
          "id": "random-unique-id"
      }
  };
  const headers = {
      'Content-Type': 'application/json',
      'Accept': '*//*',
'X-Country': 'ZM',
'X-Currency': 'ZMW',
'Authorization': `Bearer ${token}`
};*/


  /* Airtel Payment
  const payment = fetch('https://openapiuat.airtel.africa/merchant/v1/payments/',
      {
          mode: 'no-cors',
          method: 'POST',
          body: inputBody,
          headers: headers
      })
      .then(function (res) {
          return res.json();
      }).then(function (body) {
          console.log(body);
      });*/

})

router.post("/mtn", async (req, res) => {
  console.log(req.body)

  try {

    const headers = {
      'Content-Type': 'application/json',
      "Ocp-Apim-Subscription-Key": "e0cad376c7a8425f88dde4d5a743a1a5",
      "X-Reference-Id": "66366418-e654-43f7-8e63-12b9fcf45bae",
    };

    const data = {
      providerCallbackHost: 'https://webhook.site/6185b0b3-8eb2-46fb-b17a-4f029124b482',
      // other key-value pairs as required by the endpoint
    };

    //  const res = await axios.post('https://sandbox.momodeveloper.mtn.com/v1_0/apiuser', data, { headers })
    const apiUser = "66366418-e654-43f7-8e63-12b9fcf45bae"
    //console.log(apiUser)

    const response = await axios({
      method: "post",
      url: `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${apiUser}/apikey`,
      headers: {
        'Content-Type': 'application/json',
        "Ocp-Apim-Subscription-Key": "e0cad376c7a8425f88dde4d5a743a1a5",
      }
    })

    // Concatenate and encode
    const encodedCredentials = Buffer.from(`${apiUser}:${response.data.apiKey}`).toString('base64');

    const apiToken = await axios({
      method: "post",
      url: "https://sandbox.momodeveloper.mtn.com/collection/token/",
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        "Ocp-Apim-Subscription-Key": "e0cad376c7a8425f88dde4d5a743a1a5",
      },
      data: {}
    })

    const accessToken = apiToken.data.access_token

    const payment = await axios({
      method: "post",
      url: "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
      data: {
        "amount": "20",
        "currency": "EUR",
        "externalId": "2607651063494",
        "payer": {
          "partyIdType": "MSISDN",
          "partyId": "46733123454",
        },
        "payerMessage": "Succesful purchase of these goods",
        "payeeNote": "Received payment for these goods"
      },
      headers: {
        "X-Reference-Id": uuidv4(),
        "X-Target-Environment": "sandbox",
        "Ocp-Apim-Subscription-Key": "e0cad376c7a8425f88dde4d5a743a1a5",
        "Authorization": `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    })
    res.status(200).json("Payment was succesful..!");
  } catch (error) {
    console.log(error)
  }
})

router.post("/visa", async (req, res) => {
  console.log("Visa Payment Gateway")
})


/* MTN Payment
const URL = "https://api.mtn.com/v1/payments"

const mtnMobile = async () => {
    const payment = await axios({
        method: 'post',
        url: URL,
        data: {
            correlatorId: "c5f80cb8-dc8b-11ea-87d0-0242ac130003",
            paymentDate: Date.now(),
            transactionType: "Payment",
            callbackURL: "https://tadmor-stripe.vercel.app/",
            authorizationCode: null,
            feeBearer: "Payer",
            amount: {
                amount: 50,
                units: "ZMW"
            },
            totalAmount: {
                amount: 50,
                units: "ZMW"
            },
            payer: {
                payerIdType: "MSISDN",
                payerId: "233364654737",
                payerNote: "Manual Boost for RWC",
                payerName: "string",
                payerEmail: "string",
                payerRef: "233364654737",
                payerSurname: "Orimoloye",
                includePayerCharges: true
            },
            payee: [
                {
                    amount: {},
                    taxAmount: {},
                    totalAmount: {},
                    payeeIdType: "USER",
                    payeeId: "AYO.DEPOSIT",
                    payeeNote: "Manual Boost for RWC",
                    payeeName: "string"
                }
            ],
            paymentMethod: {
                name: "Manual Boost for RWC",
                description: "Manual Boost for RWC",
                validFrom: Date.now(),
                validTo: "2023-07-21T17:32:28Z",
                type: "Mobile Money",
                details: {
                    bankCard: {},
                    tokenizedCard: {},
                    bankAccountDebit: {},
                    bankAccountTransfer: {},
                    account: {},
                    loyaltyAccount: {},
                    bucket: {},
                    voucher: {},
                    digitalWallet: {},
                    invoice: {}
                }
            },
            status: "Pending",
            statusDate: "2020-08-12T11:04:53.668Z",
            additionalInformation: [
                {
                    name: "BundleName",
                    description: "Voice_1111"
                }
            ],
            segment: "subscriber"
        }
    });
    console.log(payment.res.data)
}

*/

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

module.exports = router;
