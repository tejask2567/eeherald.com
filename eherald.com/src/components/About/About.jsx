import React from "react";
import logo from "../../assets/Images/eeherald-logo.png";
import nsrp from "../../assets/Images/nsrp.jpg";
const About = () => {
  return (
    <>
      <section class="full-container products-list-page">
        <div class="container wrapper">
          <div class="brud-crumb">
            <span>
              <a href="/">Home</a>
              <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            </span>
            <span class="text">About Us</span>
          </div>
        </div>
      </section>

      <section class="full-container products-list-page about-us-holder">
        <div class="container wrapper">
          <div class="row">
            <div class="col-md-12">
              <div class="app-heading">About Us</div>
            </div>
          </div>
          <div class="row about-us-container min-height-container">
            <div class="col-xs-12 col-sm-12 col-md-5 col-lg-4 img-text-holder">
              <img src={logo} alt="Eeherald logo" />
              <div>
                Electronics Engineering Herald is an online magazine published
                by{" "}
                <a class="links" href="http://www.emittsolutions.com">
                  EMITT Solutions
                </a>{" "}
                for electronic engineers with focus on hardware design,
                embedded, VLSI, and design tools. EE Herald publishes design
                ideas, technology trends, course materials, electronic industry
                related news and new products.
              </div>

              <div>
                <br></br>
                <b>
                  <a
                    class="links"
                    href="https://www.linkedin.com/in/srinivasa-ee-editor"
                  >
                    Srinivasa Reddy N
                  </a>
                </b>{" "}
                is the Editor-in-Chief of EE Herald <br></br>.<br></br>
                <a href="https://www.linkedin.com/in/srinivasa-ee-editor">
                  <img src={nsrp} alt="Header ad"></img>{" "}
                </a>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-7 col-lg-8 content-outer-holder">
              <div class="content-header">
                The main sections of our magazine are,
              </div>

              <div class="content-holder">
                <div class="content-title">News - </div>
                <div class="content-description">
                  News stories are published with independent analysis.
                </div>
              </div>

              <div class="content-holder">
                <div class="content-title">New products -</div>
                <div class="content-description">
                  Semiconductor devices, passive components, T&M, EDA tools and
                  any such EE related new products are announced on daily basis.
                </div>
              </div>

              <div class="content-holder">
                <div class="content-title">Design-guide - </div>
                <div class="content-description">
                  Circuit ideas, reference-designs, technology trends, design
                  hints, and component selection ideas will appear in this
                  section.
                </div>
              </div>

              <div class="content-holder">
                <div class="content-title">Online course -</div>
                <div class="content-description">
                  We have published a full online course on ARM based Embedded
                  systems. It's very popular among learning engineers.
                </div>
              </div>

              <div class="content-holder">
                <div class="content-title">Student Section - </div>
                <div class="content-description">
                  Here the content is customized for engineering students.
                </div>
              </div>

              <div class="content-holder">
                <div class="content-title">India specific - </div>
                <div class="content-description">
                  News and trends specific to India's electronic industry
                  market.
                </div>
              </div>

              <div class="content-holder">
                <div class="content-title">Advertise in EE Herald</div>
              </div>

              <div class="content-holder">
                <div class="content-description">
                  <a
                    target="_blank"
                    href=" https://eeherald.s3.amazonaws.com/uploads/advertise/eeherald-press-kit.pdf"
                    rel="noreferrer"
                  >
                    <b>Click this for media pack</b>
                  </a>
                </div>
              </div>

              <div class="text-info">
                EE Herald looking for partner/sponsorer to renew itself for the
                next wave of growth in electronics. To know more please email to
                nsr(at the rate of)emittsolutions.com
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
