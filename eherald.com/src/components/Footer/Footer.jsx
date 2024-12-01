import React from "react";
import { Link } from "react-router-dom";
import "../../assets/application.css"
import logo from '../../assets/Images/eeherald-logo.png'
const Footer = () => {
  return (
    <>
      <footer className="full-container">
        <div className="container wrapper footer-wrapper">
          <div className="footer-panel first">
            <div className="heading">ABOUT US</div>
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Eeherald logo" />
              </Link>
            </div>
            <div className="description">
              Electronics Engineering Herald is an online magazine for
              electronic engineers with focus on hardware design, embedded,
              VLSI, and design tools. EE Herald publishes design ideas,
              technology trends, course materials, electronic industry related
              news and news products.{" "}
            </div>
            <div className="contact">
              <div className="e-mail">E-mail: editor@eeherald.com</div>
              <div className="phone">Tel: +91 9449816029</div>
            </div>
          </div>
          <div className="footer-panel second">
            <div className="heading">MAIN LINKS</div>
            <ul className="lists">
              <li className="links-holder">
                <a className="links" href="/news">
                  News
                </a>
              </li>
              <li className="links-holder">
                <a className="links" href="/products">
                  Products
                </a>
              </li>
              <li className="links-holder">
                <a className="links" href="/design-guides">
                  Design Guide
                </a>
              </li>
              <li className="links-holder">
                <a className="links" href="/component-engg">
                  Component Eng
                </a>
              </li>

              <li className="links-holder">
                <a className="links" href="/students">
                  Student Section
                </a>
              </li>

              <li className="links-holder">
                <a className="links" href="/events">
                  Events
                </a>
              </li>

              <li className="links-holder">
                <a className="links" href="/whats-new">
                  What&#39;s New
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-panel third">
            <div className="heading">PRODUCTS</div>
            <ul className="lists">
              <li className="links-holder">
                <a className="links" href="/component/memory/index.html">
                  Memory
                </a>
              </li>
              <li className="links-holder">
                <a className="links" href="/component/analog/index.html">
                  Analog
                </a>
              </li>
              <li className="links-holder">
                <a className="links" href="/component/logic/index.html">
                  Logic and Interface
                </a>
              </li>
              <li className="links-holder">
                <a className="links" href="/component/pld/index.html">
                  PLD/ FPGA
                </a>
              </li>
              <li className="links-holder">
                <a className="links" href="/component/automotive/index.html">
                  Automotive ICs
                </a>
              </li>
              <li className="links-holder">
                <a
                  className="links"
                  href="/component/india-semiconductor/index.html"
                >
                  India Semiconductor
                </a>
              </li>
              <li className="links-holder">
                <a className="links" href="/component/processor/index.html">
                  Processor/MCU/DSP
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-panel fourth">
            <div className="heading">OTHER LINKS</div>
            <ul className="lists">
              <li className="links-holder">
                <a className="links" href="/subscribe-newsletter.html">
                  Subscribe Newsletter
                </a>
              </li>

              <li className="links-holder">
                <a className="links" href="/advertise.html">
                  Advertise
                </a>
              </li>

              <li className="links-holder">
                <a className="links" href="/contact-us.html">
                  Contact Us
                </a>
              </li>
            </ul>
            <div className="heading other-links">FOLLOW US ON</div>
            <ul className="lists other-links">
              <li className="links-holder">
                <a href="#" className="links">
                  <i className="fa fa-twitter" aria-hidden="true"></i>
                </a>
              </li>
              <li className="links-holder">
                <a href="#" className="links">
                  <i className="fa fa-facebook" aria-hidden="true"></i>
                </a>
              </li>
              <li className="links-holder">
                <a href="#" className="links">
                  <i className="fa fa-linkedin" aria-hidden="true"></i>
                </a>
              </li>
              <li className="links-holder">
                <a href="#" className="links">
                  <i className="fa fa-youtube-play" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container wrapper footer-wrapper copy-right-wrapper">
          <span>
            Copyright &copy; 2017 - Electronics Engineering Herald, All Rights
            Reserved.
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
