import connect = require("connect");
import express = require("express");
import referrerPolicy = require("../..");

connect().use(referrerPolicy());
connect().use(referrerPolicy({}));
connect().use(referrerPolicy({ policy: "no-referrer" }));
connect().use(referrerPolicy({ policy: "no-referrer-when-downgrade" }));
connect().use(referrerPolicy({ policy: "same-origin" }));
connect().use(referrerPolicy({ policy: "origin" }));
connect().use(referrerPolicy({ policy: "strict-origin" }));
connect().use(referrerPolicy({ policy: "origin-when-cross-origin" }));
connect().use(referrerPolicy({ policy: "strict-origin-when-cross-origin" }));
connect().use(referrerPolicy({ policy: "unsafe-url" }));
connect().use(referrerPolicy({ policy: "" }));

express().use(referrerPolicy());
express().use(referrerPolicy({}));
express().use(referrerPolicy({ policy: "no-referrer" }));
express().use(referrerPolicy({ policy: "no-referrer-when-downgrade" }));
express().use(referrerPolicy({ policy: "same-origin" }));
express().use(referrerPolicy({ policy: "origin" }));
express().use(referrerPolicy({ policy: "strict-origin" }));
express().use(referrerPolicy({ policy: "origin-when-cross-origin" }));
express().use(referrerPolicy({ policy: "strict-origin-when-cross-origin" }));
express().use(referrerPolicy({ policy: "unsafe-url" }));
express().use(referrerPolicy({ policy: "" }));
