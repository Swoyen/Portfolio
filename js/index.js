var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML =
    '<span class="wrap">' +
    this.txt +
    '<span class="blinker"></span>' +
    "</span>";

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 1500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

var ExpType = function (el, expData, period) {
  this.expData = expData;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
  this.prevState = "";
  this.lastIndex = 0;
  this.headerDone = false;
  this.listsDone = 0;
  this.stopAnimating = false;
};

ExpType.prototype.tick = function () {
  if (this.stopAnimating) {
    return;
  }
  var totalLength = getTotalText(this.expData);
  if (this.loopNum == 0) typeSpan(this, this.expData.role, "emp-role");
  else if (this.loopNum == 1)
    typeSpan(this, this.expData.company, "emp-company");
  else if (this.loopNum == 2)
    typeSpan(
      this,
      this.expData.start_date + " - " + this.expData.end_date,
      "emp-date"
    );
  else if (this.loopNum == 3)
    typeList(this, this.expData.tasks, "emp-tasks", "Tasks: ", false);
  else if (this.loopNum == 4) {
    typeList(
      this,
      this.expData.technologies,
      "emp-technologies",
      "Technologies used:",
      true
    );
  }
};

var typeSpeed = 30;
var initializing = false;
ExpType.prototype.deleteText = function () {
  this.el.innerHTML +=
    "<div class='white' id='box' data-aos='fade-in' data-aos-easing='linear' data-aos-anchor='top-bottom' data-aos-delay='1000'>" +
    this.el.innerHTML +
    "</div><div id='box2'><span class='mouse-unclicked'> </span></div>";
  setTimeout(() => {
    this.el.innerHTML =
      "<span class='wrap'><span class='tiny-blinker'></span></span>";
  }, 3000);
};

function typeSpan(expType, txt, spanClass) {
  // if (expType.isDeleting) {
  //   expType.txt = role.substring(0, expType.txt.length - 1);
  // } else {
  // }
  if (typeof txt == "string") {
    var newTxt = txt;
    expType.txt = newTxt.substring(0, expType.txt.length + 1);
    expType.el.innerHTML =
      (expType.loopNum == 0 ? '<span class="wrap">' : expType.prevState) +
      '<span class="' +
      spanClass +
      '">' +
      expType.txt +
      '</span><span class="tiny-blinker"></span>' +
      "</span>";
  }
  var that = expType;
  var delta = typeSpeed - Math.random() * typeSpeed;

  if (expType.isDeleting) {
    delta /= 2;
  }

  // if (!expType.isDeleting && expType.txt === role) {
  //   delta = expType.period;
  //   expType.isDeleting = true;
  // } else if (expType.isDeleting && expType.txt === "") {
  //   expType.isDeleting = false;
  //   expType.loopNum++;
  //   delta = 1500;
  // }
  if (expType.txt == txt) {
    expType.txt = "";
    expType.loopNum++;
    var index = expType.el.innerHTML.indexOf("</span>", expType.lastIndex);
    expType.prevState =
      expType.el.innerHTML.substring(0, index) + "</span></br>";
    expType.lastIndex = index + 1;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
}

function typeList(expType, lst, divClass, header, keepCursor) {
  if (!expType.headerDone) {
    var newTxt = header;
    expType.txt = newTxt.substring(0, expType.txt.length + 1);
    expType.el.innerHTML =
      expType.prevState +
      "<div class=" +
      divClass +
      "><span class='exp-subheader'>" +
      expType.txt +
      "</span>" +
      (expType.txt.length == header.length
        ? ""
        : '<span class="tiny-blinker"></span>') +
      "</div>" +
      "</span>";
  } else {
    var newTxt = lst[expType.listsDone];
    expType.txt = newTxt.substring(0, expType.txt.length + 1);
    expType.el.innerHTML =
      expType.prevState +
      "<li>" +
      expType.txt +
      (expType.txt.length == lst[expType.listsDone].length
        ? ""
        : "<span class='tiny-blinker'></span>") +
      (expType.listsDone == lst.length - 1
        ? keepCursor
          ? "<span class='tiny-blinker'></span>"
          : ""
        : "");
    "</li>" + "</ol></div>";
  }

  var that = expType;
  var delta = typeSpeed - Math.random() * typeSpeed;

  if (!expType.headerDone && expType.txt == header) {
    expType.txt = "";
    // expType.loopNum++;
    var index = expType.el.innerHTML.indexOf("</div>", expType.lastIndex);
    expType.prevState = expType.el.innerHTML.substring(0, index) + "<ol>";
    expType.lastIndex = index + 1;
    expType.headerDone = true;
  } else if (expType.txt == lst[expType.listsDone]) {
    expType.listsDone++;
    expType.txt = "";
    var index = expType.el.innerHTML.indexOf("</ol>", expType.lastIndex);
    expType.prevState = expType.el.innerHTML.substring(0, index) + "";
    expType.lastIndex = index + 1;
  }

  if (expType.listsDone == lst.length) {
    var index = expType.el.innerHTML.indexOf("</div>", expType.lastIndex);
    expType.prevState =
      expType.el.innerHTML.substring(0, index) + "</div></br>";
    expType.lastIndex = index + 1;
    expType.loopNum++;
    expType.txt = "";
    expType.headerDone = false;
    expType.listsDone = 0;
  }
  setTimeout(function () {
    that.tick();
  }, delta);
}

var workData;
var progressBarNums;
var progressBar;

window.onload = function () {
  AOS.init({
    once: true, // whether animation should happen only once - while scrolling down
  });
  var elements = document.getElementsByClassName("typewrite");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-type");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
  this.workData = JSON.parse(data);
  progressBar = document.getElementsByClassName("coding-skills")[0];

  checkProgressBarScrolled();
};

function checkProgressBarScrolled() {
  if (isInViewport(progressBar)) {
    progressBarScrolled = true;
    var progressBarInners =
      document.getElementsByClassName("progress-bar-inner");
    for (i = 0; i < progressBarInners.length; i++) {
      progressBarInners[i].classList.add("progress-bar" + i);
    }
    animateProgressNum();
  } else {
    setTimeout(() => {
      checkProgressBarScrolled();
    }, 300);
  }
}

function isInViewport(element) {
  var bounding = element.getBoundingClientRect();
  if (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
  ) {
    return true;
  } else {
    return false;
  }
}

function animateProgressNum() {
  progressBarNums = document.getElementsByClassName("coding-skill-num");
  for (i = 0; i < 100; i += 1) {
    increaseProgress(i);
  }
}

progressBarScrolled = false;

progressBar0 = 60;
progressBar1 = 60;
progressBar2 = 60;
progressBar3 = 60;

function increaseProgress(num) {
  setTimeout(() => {
    num;
    b0 = (num / 100) * progressBar0;
    b1 = (num / 100) * progressBar1;
    b2 = (num / 100) * progressBar2;
    b3 = (num / 100) * progressBar3;
    progressBarNums[0].innerHTML = "" + Math.ceil(b0) + "%";
    progressBarNums[1].innerHTML = "" + Math.ceil(b1) + "%";
    progressBarNums[2].innerHTML = "" + Math.ceil(b2) + "%";
    progressBarNums[3].innerHTML = "" + Math.ceil(b3) + "%";
  }, 30 * num);
}

var lastScrollTop = 0;
window.addEventListener(
  "scroll",
  function () {
    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    var navbar = document.getElementsByClassName("navbar")[0];
    var logo = document.getElementsByClassName("logo")[0];
    if (st > lastScrollTop) {
      navbar.classList.add("shrinked");
      navbar.classList.remove("expanded");
      logo.classList.add("shrinked-logo");
      logo.classList.remove("expanded-logo");
    } else {
      navbar.classList.remove("shrinked");
      navbar.classList.add("expanded");
      logo.classList.remove("shrinked-logo");
      logo.classList.add("expanded-logo");
    }
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  },
  false
);

var currentExpType = null;
function showDetails(index) {
  if (initializing) {
    return;
  }

  var ec = document.getElementsByClassName("experience-circle");

  for (i = 0; i < ec.length; i++) {
    var ind = ec.length - i - 1;
    // if (index === i) ec[index].classList.add("clicked");
    // else ec[i].classList.remove("clicked");
    if (index === ind) ec[i].name = "play";
    else ec[i].name = "play-outline";
  }

  if (currentExpType) {
    currentExpType.stopAnimating = true;
    currentExpType.deleteText();
  }

  var de = document.getElementsByClassName("detailed-experience")[0];
  var data = workData[index];
  var content =
    "<div data-aos='zoom-in'><div data-aos='fade-left' data-aos-delay='200'><span class='emp-role'>" +
    data.role +
    "</span><br/>";
  content += "<span class='emp-company'>" + data.company + "</span><br/>";
  content += "<span class='emp-date'>" + data.start_date + " - ";
  content += data.end_date + "</span></br></div>";
  content +=
    "<div class='emp-tasks' data-aos='fade-left' data-aos-delay='400'><span class='exp-subheader'>Tasks: </span>";

  var tasks = data.tasks;
  var formattedTasks = "<ol>";
  tasks.forEach((task) => {
    formattedTasks += "<li>" + task + "</li>";
  });
  formattedTasks += "</ol>";
  content += formattedTasks + "</div><br/>";
  content +=
    "<div class='emp-technologies' data-aos='fade-left' data-aos-delay='600'><span class='exp-subheader'>Technologies: </span>";
  var techs = data.technologies;
  var formattedTech = "<ol>";
  techs.forEach((tech) => {
    formattedTech += "<li>" + tech + "</li>";
  });
  formattedTech += "</ol>";
  content += formattedTech + "</div><br/>";

  var element = document.getElementsByClassName("typewrite2")[0];
  var period = 2000;
  initializing = true;
  if (currentExpType) {
    setTimeout(() => {
      currentExpType = new ExpType(element, data, period);
      initializing = false;
    }, 3500);
  } else {
    currentExpType = new ExpType(element, data, period);
    setTimeout(() => {
      initializing = false;
    });
  }
  // de.innerHTML = "<p>" + content + "</p>";}
}

function getTotalText(expData) {
  length += expData.role.length;
  length += expData.company.length;
  length += expData.start_date.length;
  length += (" - " + expData.end_date).length;
  length += "Tasks: ".length;
  var tasks = expData.tasks;
  tasks.forEach((task) => {
    length += ("xx." + task).length;
  });
  length += "Technologies used: ".length;
  var techs = expData.technologies;
  techs.forEach((tech) => {
    length += ("xx." + tech).length;
  });

  return 0;
}

var profilePic = document.getElementsByClassName("profile-pic")[0];
profilePic.addEventListener("mouseover", function () {
  this.classList.add("profile-hover");
});

profilePic.addEventListener("mouseout", function () {
  setTimeout(function () {
    profilePic.classList.remove("profile-hover");
  }, 100);
});

var inCard = false;

var currentCard = -1;

var sources = [
  "https://restrantau.netlify.app",
  "http://laraveltnnis-env.eba-5ixqqbqu.us-east-2.elasticbeanstalk.com/",
  "https://barebones-youtube-player.netlify.app",
];

var codes = [
  "https://github.com/Swoyen/restaurant-front-end",
  "https://github.com/Swoyen/laravel-tennis",
  "https://barebones-youtube-player.netlify.app",
];

function openSource(index) {
  window.open(sources[index]);
}

function openCode(index) {
  window.open(codes[index]);
}

function clickCard(index) {
  var cards = document.getElementsByClassName("hover-card");
  if (index === currentCard) {
    unClickCard();
  } else {
    for (i = 0; i < cards.length; i++) {
      if (i === index) {
        cards[i].classList.add("hover-card-clicked");
        var folder = document.getElementById("folder" + i);

        var link = document.getElementById("folder-link" + i);
        window.open(link.href);
        folder.name = "folder-open-outline";
        currentCard = index;
      } else {
        cards[i].classList.remove("hover-card-clicked");
        var folder = document.getElementById("folder" + i);
        folder.name = "folder";
      }
    }
  }
}

function unClickCard() {
  if (currentCard != -1) {
    var cards = document.getElementsByClassName("hover-card");
    for (i = 0; i < cards.length; i++) {
      cards[i].classList.remove("hover-card-clicked");
      var folder = document.getElementById("folder" + currentCard);
      folder.name = "folder";
    }
  }
}

var cards = document.getElementsByClassName("hover-card");
for (i = 0; i < cards.length; i++) {
  cards[i].addEventListener("mouseout", function () {
    inCard = false;
  });
}

for (i = 0; i < cards.length; i++) {
  cards[i].addEventListener("mouseover", function () {
    inCard = true;
  });
}

document
  .getElementsByClassName("container")[0]
  .addEventListener("click", function () {
    if (!inCard) unClickCard();
  });

function showMenu() {
  var sidemenuoverlay = document.getElementsByClassName("side-menu-overlay")[0];
  var sidemenu = document.getElementsByClassName("side-menu")[0];
  sidemenuoverlay.classList.add("side-menu-overlay-opened");
  sidemenu.classList.add("side-menu-opened");
}

function hideMenu() {
  var sidemenuoverlay = document.getElementsByClassName("side-menu-overlay")[0];
  var sidemenu = document.getElementsByClassName("side-menu")[0];
  sidemenuoverlay.classList.remove("side-menu-overlay-opened");
  sidemenu.classList.remove("side-menu-opened");
}
