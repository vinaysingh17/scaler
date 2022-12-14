import "./App.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import {
  base_url,
  checkAuth,
  getCourses,
  getStore,
  USER_DATA,
} from "./APIs/Api";
import axios from "axios";
import {
  useNavigate,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";

function Home() {
  const [allCourses, setAllCourses] = useState([]);
  const navigation = useNavigate();
  const [userData, setUserData] = useState({});
  const [selectedCourse, setSelectedCourse] = useState({});
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    // console.log(localStorage.getItem(USER_DATA), "<<<use data");
    setUserData(getStore(USER_DATA));
    getCourses((res) => {
      console.log(res, "<<<thisis result data");
      setAllCourses(res.data);
    });
  }, []);

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function showRazorPay2() {
    // console.log("updating the user with id--->>>>", id);

    if (!userData) {
      // return alert("Please login to buy the course");
      return navigation("/login");
    }

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    const result = await axios.get(base_url + "/payment/createorder/");

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }
    console.log(result, "<<<result");

    // Getting the order details back

    const { amount, id, currency } = result.data;
    // const liveKey = "rzp_live_rWC4iXaB2ed5LL"; // old live key
    // const testKey = "rzp_test_Ten1Hjtq2zzxMw"; // old test key

    const liveKey = "rzp_live_XVo1ue3IK3yAAY"; // new live key Qj8JmIxBHERf69sIZAb6qiu7

    const options = {
      // key: "rzp_live_XVo1ue3IK3yAAY", // Enter the Key ID generated from the Dashboard
      key: liveKey,
      amount: amount.toString(),
      currency: currency,
      name: "Vertex Education",
      description: "Coaching Institue for (IIT / Medical students)",
      // image: { logo },
      order_id: id,
      handler: async function (response) {
        const data = {
          orderCreationId: id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          userId: userData._id,
          ...selectedCourse,
          courseId: selectedCourse._id,
        };
        console.log(data);

        // 0000
        // return null;

        const result = await axios.post(
          base_url + "/payment/payment/callback",
          data
        );
        console.log(result);

        // alert(result.data.msg);
      },
      prefill: {
        name: "akshay",
        email: "lakheraakshay@gmail.com",
        contact: "7845874589",
      },
      notes: {
        address: "address",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="App">
      {/* <div id="preloader-active"> */}
      {/* <div class="preloader d-flex align-items-center justify-content-center">
          <div class="preloader-inner position-relative">
            <div class="preloader-circle"></div>
            <div class="preloader-img pere-text">
              <img src="assets/img/logo/loder.png" alt="" />
            </div>
          </div>
        </div>
      </div> */}
      <header>
        <div class="header-area header-transparent">
          <div class="main-header ">
            <div class="header-bottom  header-sticky">
              <div class="container-fluid">
                <div class="row align-items-center">
                  <div class="col-xl-2 col-lg-2">
                    <div class="logo">
                      <a href="index.html">
                        <img src="assets/img/logo/logo.png" alt="" />
                      </a>
                    </div>
                  </div>
                  <div class="col-xl-10 col-lg-10">
                    <div class="menu-wrapper d-flex align-items-center justify-content-end">
                      <div class="main-menu d-none d-lg-block">
                        <nav>
                          <ul id="navigation">
                            {/* <li class="active">
                              <a href="/">Home</a>
                            </li>
                            <li>
                              <a href="/">Courses</a>
                            </li>
                            <li>
                              <a href="/">About</a>
                            </li>
                            <li>
                              <a href="#">Blog</a>
                              <ul class="submenu">
                                <li>
                                  <a href="blog.html">Blog</a>
                                </li>
                                <li>
                                  <a href="blog_details.html">Blog Details</a>
                                </li>
                                <li>
                                  <a href="elements.html">Element</a>
                                </li>
                              </ul>
                            </li> */}
                            <li>
                              <a href="/">Home</a>
                            </li>
                            {getStore(checkAuth) != "true" && (
                              <>
                                <li class="button-header margin-left ">
                                  <a href="signup" class="btn">
                                    Sign Up
                                  </a>
                                </li>
                                <li class="button-header">
                                  <a href="/login" class="btn btn3">
                                    Sign in
                                  </a>
                                </li>
                              </>
                            )}
                            {getStore(checkAuth) == "true" && (
                              <>
                                <li
                                  class="button-header margin-left "
                                  style={{ color: "white", cursor: "pointer" }}
                                  onClick={() => {
                                    // localStorage.removeItem(checkAuth);
                                    // localStorage.removeItem(userData);
                                    // window.location.reload(true);
                                  }}
                                >
                                  <a
                                    // href="https://scaler-dashboard.vercel.app/user/course"
                                    href="/profile"
                                    class="btn"
                                  >
                                    Dashboard
                                  </a>
                                </li>
                                <li
                                  class="button-header margin-left "
                                  style={{ color: "white", cursor: "pointer" }}
                                  onClick={() => {
                                    localStorage.removeItem(checkAuth);
                                    localStorage.removeItem(userData);
                                    window.location.reload(true);
                                  }}
                                >
                                  {/* <a href=".signup" class="btn"> */}
                                  Logout
                                  {/* </a> */}
                                </li>
                              </>
                            )}
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="mobile_menu d-block d-lg-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section class="slider-area ">
          <div class="slider-active">
            <div class="single-slider slider-height d-flex align-items-center">
              <div class="container">
                <div class="row">
                  <div class="col-xl-6 col-lg-7 col-md-12">
                    <div class="hero__caption">
                      <h1 data-animation="fadeInLeft" data-delay="0.2s">
                        Online learning
                        <br /> platform
                      </h1>
                      <p data-animation="fadeInLeft" data-delay="0.4s">
                        Build skills with courses, certificates, and degrees
                        online from world-class universities and companies
                      </p>
                      <a
                        href="#"
                        class="btn hero-btn"
                        data-animation="fadeInLeft"
                        data-delay="0.7s"
                      >
                        Join for Free
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="services-area">
          <div class="container">
            <div class="row justify-content-sm-center">
              <div class="col-lg-4 col-md-6 col-sm-8">
                <div class="single-services mb-30">
                  <div class="features-icon">
                    <img src="assets/img/icon/icon1.svg" alt="" />
                  </div>
                  <div class="features-caption">
                    <h3>60+ UX courses</h3>
                    <p>The automated process all your website tasks.</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-8">
                <div class="single-services mb-30">
                  <div class="features-icon">
                    <img src="assets/img/icon/icon2.svg" alt="" />
                  </div>
                  <div class="features-caption">
                    <h3>Expert instructors</h3>
                    <p>The automated process all your website tasks.</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-8">
                <div class="single-services mb-30">
                  <div class="features-icon">
                    <img src="assets/img/icon/icon3.svg" alt="" />
                  </div>
                  <div class="features-caption">
                    <h3>Life time access</h3>
                    <p>The automated process all your website tasks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="courses-area section-padding40 fix">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-xl-7 col-lg-8">
                <div class="section-tittle text-center mb-55">
                  <h2>Our featured courses</h2>
                </div>
              </div>
            </div>
            <div class="courses-actives">
              <Slider {...settings}>
                {allCourses.map((item) => {
                  return (
                    <div class="properties pb-20">
                      <div class="properties__card">
                        <div class="properties__img overlay1">
                          <a href="#">
                            <img
                              // src="assets/img/gallery/featured1.png"
                              src={item?.courseImageImage}
                              style={{
                                objectFit: "cover",
                                width: "200px",
                                margin: "auto",
                              }}
                              alt=""
                              width="200px"
                            />
                          </a>
                        </div>
                        <div class="properties__caption">
                          <p>User Experience</p>
                          <h3>
                            <a href="#">{item?.courseTitle}</a>
                          </h3>
                          <p>{item?.courseDescription}</p>
                          <div class="properties__footer d-flex justify-content-between align-items-center">
                            <div class="restaurant-name">
                              <div class="rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half"></i>
                              </div>
                              <p>
                                <span>(4.5)</span> based on 120
                              </p>
                            </div>
                            <div class="price">
                              <span>Rs ${item.courseAmount}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (getStore(checkAuth) != "true")
                                return (window.location.href = "/login");
                              setSelectedCourse(item);
                              showRazorPay2();
                            }}
                            class="border-btn border-btn2"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* <div class="properties pb-20">
                  <div class="properties__card">
                    <div class="properties__img overlay1">
                      <a href="#">
                        <img src="assets/img/gallery/featured2.png" alt="" />
                      </a>
                    </div>
                    <div class="properties__caption">
                      <p>User Experience</p>
                      <h3>
                        <a href="#">Fundamental of UX for Application design</a>
                      </h3>
                      <p>
                        The automated process all your website tasks. Discover
                        tools and techniques to engage effectively with
                        vulnerable children and young people.
                      </p>
                      <div class="properties__footer d-flex justify-content-between align-items-center">
                        <div class="restaurant-name">
                          <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half"></i>
                          </div>
                          <p>
                            <span>(4.5)</span> based on 120
                          </p>
                        </div>
                        <div class="price">
                          <span>$135</span>
                        </div>
                      </div>
                      <a href="#" class="border-btn border-btn2">
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
                <div class="properties pb-20">
                  <div class="properties__card">
                    <div class="properties__img overlay1">
                      <a href="#">
                        <img src="assets/img/gallery/featured3.png" alt="" />
                      </a>
                    </div>
                    <div class="properties__caption">
                      <p>User Experience</p>
                      <h3>
                        <a href="#">Fundamental of UX for Application design</a>
                      </h3>
                      <p>
                        The automated process all your website tasks. Discover
                        tools and techniques to engage effectively with
                        vulnerable children and young people.
                      </p>
                      <div class="properties__footer d-flex justify-content-between align-items-center">
                        <div class="restaurant-name">
                          <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half"></i>
                          </div>
                          <p>
                            <span>(4.5)</span> based on 120
                          </p>
                        </div>
                        <div class="price">
                          <span>$135</span>
                        </div>
                      </div>
                      <a href="#" class="border-btn border-btn2">
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
                <div class="properties pb-20">
                  <div class="properties__card">
                    <div class="properties__img overlay1">
                      <a href="#">
                        <img src="assets/img/gallery/featured2.png" alt="" />
                      </a>
                    </div>
                    <div class="properties__caption">
                      <p>User Experience</p>
                      <h3>
                        <a href="#">Fundamental of UX for Application design</a>
                      </h3>
                      <p>
                        The automated process all your website tasks. Discover
                        tools and techniques to engage effectively with
                        vulnerable children and young people.
                      </p>
                      <div class="properties__footer d-flex justify-content-between align-items-center">
                        <div class="restaurant-name">
                          <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half"></i>
                          </div>
                          <p>
                            <span>(4.5)</span> based on 120
                          </p>
                        </div>
                        <div class="price">
                          <span>$135</span>
                        </div>
                      </div>
                      <a href="#" class="border-btn border-btn2">
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div> */}
              </Slider>
            </div>
          </div>
        </div>
        <section class="about-area1 fix pt-10">
          <div class="support-wrapper align-items-center">
            <div class="left-content1">
              <div class="about-icon">
                <img src="assets/img/icon/about.svg" alt="" />
              </div>
              <div class="section-tittle section-tittle2 mb-55">
                <div class="front-text">
                  <h2 class="">Learn new skills online with top educators</h2>
                  <p>
                    The automated process all your website tasks. Discover tools
                    and techniques to engage effectively with vulnerable
                    children and young people.
                  </p>
                </div>
              </div>
              <div class="single-features">
                <div class="features-icon">
                  <img src="assets/img/icon/right-icon.svg" alt="" />
                </div>
                <div class="features-caption">
                  <p>
                    Techniques to engage effectively with vulnerable children
                    and young people.
                  </p>
                </div>
              </div>
              <div class="single-features">
                <div class="features-icon">
                  <img src="assets/img/icon/right-icon.svg" alt="" />
                </div>
                <div class="features-caption">
                  <p>
                    Join millions of people from around the world learning
                    together.
                  </p>
                </div>
              </div>

              <div class="single-features">
                <div class="features-icon">
                  <img src="assets/img/icon/right-icon.svg" alt="" />
                </div>
                <div class="features-caption">
                  <p>
                    Join millions of people from around the world learning
                    together. Online learning is as easy and natural.
                  </p>
                </div>
              </div>
            </div>
            <div class="right-content1">
              <div class="right-img">
                <img src="assets/img/gallery/about.png" alt="" />

                <div class="video-icon">
                  <a
                    class="popup-video btn-icon"
                    href="https://www.youtube.com/watch?v=up68UAfH0d0"
                  >
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="topic-area section-padding40">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-xl-7 col-lg-8">
                <div class="section-tittle text-center mb-55">
                  <h2>Explore top subjects</h2>
                </div>
              </div>
            </div>
            <div class="row">
              {allCourses.map((item) => {
                return (
                  <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="single-topic text-center mb-30">
                      <div class="topic-img">
                        {/* <img src="assets/img/gallery/topic1.png" alt="" /> */}
                        <img
                          src={item.courseImageImage}
                          alt=""
                          style={{ objectFit: "cover" }}
                          height="200px"
                        />
                        <div class="topic-content-box">
                          <div class="topic-content">
                            <h3>
                              <a href="#">{item.courseName}</a>
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="single-topic text-center mb-30">
                  <div class="topic-img">
                    <img src="assets/img/gallery/topic2.png" alt="" />
                    <div class="topic-content-box">
                      <div class="topic-content">
                        <h3>
                          <a href="#">Programing</a>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="single-topic text-center mb-30">
                  <div class="topic-img">
                    <img src="assets/img/gallery/topic3.png" alt="" />
                    <div class="topic-content-box">
                      <div class="topic-content">
                        <h3>
                          <a href="#">Programing</a>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="single-topic text-center mb-30">
                  <div class="topic-img">
                    <img src="assets/img/gallery/topic4.png" alt="" />
                    <div class="topic-content-box">
                      <div class="topic-content">
                        <h3>
                          <a href="#">Programing</a>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="single-topic text-center mb-30">
                  <div class="topic-img">
                    <img src="assets/img/gallery/topic5.png" alt="" />
                    <div class="topic-content-box">
                      <div class="topic-content">
                        <h3>
                          <a href="#">Programing</a>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="single-topic text-center mb-30">
                  <div class="topic-img">
                    <img src="assets/img/gallery/topic6.png" alt="" />
                    <div class="topic-content-box">
                      <div class="topic-content">
                        <h3>
                          <a href="#">Programing</a>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="single-topic text-center mb-30">
                  <div class="topic-img">
                    <img src="assets/img/gallery/topic7.png" alt="" />
                    <div class="topic-content-box">
                      <div class="topic-content">
                        <h3>
                          <a href="#">Programing</a>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="single-topic text-center mb-30">
                  <div class="topic-img">
                    <img src="assets/img/gallery/topic8.png" alt="" />
                    <div class="topic-content-box">
                      <div class="topic-content">
                        <h3>
                          <a href="#">Programing</a>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <div class="row justify-content-center">
              <div class="col-xl-12">
                {/* <div class="section-tittle text-center mt-20">
                  <a href="courses.html" class="border-btn">
                    View More Subjects
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <section class="about-area3 fix">
          <div class="support-wrapper align-items-center">
            <div class="right-content3">
              <div class="right-img">
                <img src="assets/img/gallery/about3.png" alt="" />
              </div>
            </div>
            <div class="left-content3">
              <div class="section-tittle section-tittle2 mb-20">
                <div class="front-text">
                  <h2 class="">Learner outcomes on courses you will take</h2>
                </div>
              </div>
              <div class="single-features">
                <div class="features-icon">
                  <img src="assets/img/icon/right-icon.svg" alt="" />
                </div>
                <div class="features-caption">
                  <p>
                    Techniques to engage effectively with vulnerable children
                    and young people.
                  </p>
                </div>
              </div>
              <div class="single-features">
                <div class="features-icon">
                  <img src="assets/img/icon/right-icon.svg" alt="" />
                </div>
                <div class="features-caption">
                  <p>
                    Join millions of people from around the world learning
                    together.
                  </p>
                </div>
              </div>
              <div class="single-features">
                <div class="features-icon">
                  <img src="assets/img/icon/right-icon.svg" alt="" />
                </div>
                <div class="features-caption">
                  <p>
                    Join millions of people from around the world learning
                    together. Online learning is as easy and natural.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="team-area section-padding40 fix">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-xl-7 col-lg-8">
                <div class="section-tittle text-center mb-55">
                  <h2>Community experts</h2>
                </div>
              </div>
            </div>
            <div class="team-active">
              <div class="single-cat text-center">
                <div class="cat-icon">
                  <img src="assets/img/gallery/team1.png" alt="" />
                </div>
                <div class="cat-cap">
                  <h5>
                    <a href="services.html">Mr. Urela</a>
                  </h5>
                  <p>The automated process all your website tasks.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="about-area2 fix pb-padding">
          <div class="support-wrapper align-items-center">
            <div class="right-content2">
              <div class="right-img">
                <img src="assets/img/gallery/about2.png" alt="" />
              </div>
            </div>
            <div class="left-content2">
              <div class="section-tittle section-tittle2 mb-20">
                <div class="front-text">
                  <h2 class="">
                    Take the next step toward your personal and professional
                    goals with us.
                  </h2>
                  <p>
                    The automated process all your website tasks. Discover tools
                    and techniques to engage effectively with vulnerable
                    children and young people.
                  </p>
                  <a href="#" class="btn">
                    Join now for Free
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div class="footer-wrappper footer-bg">
          <div class="footer-area footer-padding">
            <div class="container">
              <div class="row justify-content-between">
                <div class="col-xl-4 col-lg-5 col-md-4 col-sm-6">
                  <div class="single-footer-caption mb-50">
                    <div class="single-footer-caption mb-30">
                      <div class="footer-logo mb-25">
                        <a href="index.html">
                          <img src="assets/img/logo/logo2_footer.png" alt="" />
                        </a>
                      </div>
                      <div class="footer-tittle">
                        <div class="footer-pera">
                          <p>
                            The automated process starts as soon as your clothes
                            go into the machine.
                          </p>
                        </div>
                      </div>
                      <div class="footer-social">
                        <a href="#">
                          <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://bit.ly/sai4ull">
                          <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#">
                          <i class="fab fa-pinterest-p"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-2 col-lg-3 col-md-4 col-sm-5">
                  <div class="single-footer-caption mb-50">
                    <div class="footer-tittle">
                      <h4>Our solutions</h4>
                      <ul>
                        <li>
                          <a href="#">Design & creatives</a>
                        </li>
                        <li>
                          <a href="#">Telecommunication</a>
                        </li>
                        <li>
                          <a href="#">Restaurant</a>
                        </li>
                        <li>
                          <a href="#">Programing</a>
                        </li>
                        <li>
                          <a href="#">Architecture</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-xl-2 col-lg-4 col-md-4 col-sm-6">
                  <div class="single-footer-caption mb-50">
                    <div class="footer-tittle">
                      <h4>Support</h4>
                      <ul>
                        <li>
                          <a href="#">Design & creatives</a>
                        </li>
                        <li>
                          <a href="#">Telecommunication</a>
                        </li>
                        <li>
                          <a href="#">Restaurant</a>
                        </li>
                        <li>
                          <a href="#">Programing</a>
                        </li>
                        <li>
                          <a href="#">Architecture</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                  <div class="single-footer-caption mb-50">
                    <div class="footer-tittle">
                      <h4>Company</h4>
                      <ul>
                        <li>
                          <a href="#">Design & creatives</a>
                        </li>
                        <li>
                          <a href="#">Telecommunication</a>
                        </li>
                        <li>
                          <a href="#">Restaurant</a>
                        </li>
                        <li>
                          <a href="#">Programing</a>
                        </li>
                        <li>
                          <a href="#">Architecture</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer-bottom-area">
            <div class="container">
              <div class="footer-border">
                <div class="row d-flex align-items-center">
                  <div class="col-xl-12 ">
                    <div class="footer-copy-right text-center">
                      <p>
                        Copyright &copy;
                        <script>
                          document.write(new Date().getFullYear());
                        </script>{" "}
                        All rights reserved | This website is made with{" "}
                        <i class="fa fa-heart" aria-hidden="true"></i> by{" "}
                        <a href="https://strixdigital.in" target="_blank">
                          Strix Digital
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div id="back-top">
        <a title="Go to Top" href="#">
          {" "}
          <i class="fas fa-level-up-alt"></i>
        </a>
      </div>
    </div>
  );
}

export default Home;
