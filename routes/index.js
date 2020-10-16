const express = require("express");
const cors = require("cors");
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");

const router = express.Router();

const whitelist = ["https://ytg.kr", "http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const corpMapForSecurity = {
  A001: "04",
  A002: "05",
  A003: "23",
};

router.get("/track", cors(corsOptions), (req, res, next) => {
  const baseUrl = process.env.TRACKER_BASE_URL;
  const apiKey = process.env.TRACKER_API_KEY;

  const trackingCorpCode = req.query.tracking_corp_code;
  const trackingInvoiceId = req.query.tracking_invoice_id;

  const params = new URLSearchParams({
    t_key: apiKey,
    t_code: corpMapForSecurity[trackingCorpCode],
    t_invoice: trackingInvoiceId,
  });

  fetch(`${baseUrl}/api/v1/trackingInfo?${params}`, {
    headers: {
      Accept: "application/json;charset=UTF-8",
    },
  })
    .then((resp) => resp.json())
    .then((json) => {
      res.json({
        trackingCorpCode,
        trackingInvoiceId,
        trackingInfo: json,
      });
    });
});

module.exports = router;
