module.exports = function (app, passport, db) {
  // normal routes ===============================================================
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("orders")
      .find()
      .toArray()
      .then(results => {
        let notCompleted = results.filter(element => element.completed === false)
        let completed = results.filter(element => element.completed === true)
        res.render('profile.ejs', { user: req.user, orders: notCompleted, done: completed})
    })
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // message board routes ===============================================================
  app.post("/orders", (req, res) => {
    console.log(req.body, "app.put routes ejs");
    db.collection("orders").save(
      {
        name: req.body.cName,
        order: req.body.order,
        size: req.body.size,
        // cream: req.body.cream,
        // milk: req.body.milk,
        // espresso: req.body.espresso,
        // caramel: req.body.caramel,
        // sugar: req.body.style,
        completed: false,
        //arg
        status: "not made yet!",
        barista: "",
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("Saved to Orders Database");
        res.redirect("/");
      }
      );

  });

  app.put("/orders", isLoggedIn, (req, res) => {
    // console.log(req.body, "app.put routes ejs");
    // console.log("XOXOXOXOXOXXOXObarista", req.user)
    db.collection("orders").findOneAndUpdate(
      { name: req.body.name, order: req.body.order, status: "not made yet!"},
      {
        $set: {
          status: "is ready for pick-up",
          completed: true,
          barista: req.user.local.email,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });
  app.delete("/orders", (req, res) => {
    console.log("completed", req.body.completed);
    db.collection("orders").deleteMany(
      // {name: req.body.name,
      // // done: req.body.done, 
      // order: req.body.order,
      // completed: req.body.completed },
      {completed: true},
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Order deleted!");
      }
    );
  });

  // AUTHENTICATE (FIRST LOGIN) ==================================================

  // LOGIN ===============================
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  // SIGNUP =================================
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true,
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}
