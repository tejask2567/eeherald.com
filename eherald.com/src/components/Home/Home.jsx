import React, { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";
import placeholderImage from "../../assets/Images/placeholder.png";
import { useNavigate ,Link} from "react-router-dom";
import Slider from "react-slick"; // Import the react-slick carousel
import "slick-carousel/slick/slick.css"; // Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Slick theme CSS
import useAuth from "../../hooks/useAuth";
const Home = () => {
  const {auth}=useAuth();
  const [latestNews, setLatestNews] = useState([]);
  const [deepCoverage, setDeepCoverage] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [designArticles, setDesignArticles] = useState([]);
  const [carouselArticles, setCarouselArticles] = useState([]); // State for carouse

  // Fetching carousel articles
  useEffect(() => {
    const fetchCarouselArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/home/carasoul");
        setCarouselArticles(response.data.slice(0, 5)); // Limiting to 5 for carousel
      } catch (error) {
        console.error("Error fetching carousel articles:", error);
      }
    };

    fetchCarouselArticles();
  }, []);

  // Fetching other articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const newsResponse = await axios.get("http://localhost:3000/home/news");
        const deepCoverageResponse = await axios.get(
          "http://localhost:3000/home/deep-coverage"
        );
        const productsResponse = await axios.get(
          "http://localhost:3000/home/latest-products"
        );
        const designResponse = await axios.get(
          "http://localhost:3000/home/design-articles"
        );

        setLatestNews(newsResponse.data.slice(0, 4)); // Limiting to top 4
        setDeepCoverage(deepCoverageResponse.data.slice(0, 4)); // Limiting to top 4
        setLatestProducts(productsResponse.data.slice(0, 4)); // Limiting to top 4
        setDesignArticles(designResponse.data.slice(0, 4)); // Limiting to top 4
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  const placeHolderTitle = 'No Title';
  console.log(auth)
  return (
    <div className="home-container">
      {/* Carousel */}
      <Slider {...settings} className="carousel-container">
        {carouselArticles.map((article, index) => (
          <Link to={`/article/${article['ID']}`}>
          <div key={index} className="carousel-slide" >
            <img
              src={article.image || placeholderImage}
              alt={article["Article Title"] || placeHolderTitle}
              className="carousel-image"
            />
            <div className="carousel-title">{article["Article Title"] || placeHolderTitle}</div>
          </div>
          </Link>
        ))}
      </Slider>

      {/* First Row */}
      <div className="sections-row">
        <div className="section latest-news">
          <h2 className="section-title">Latest EE News</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {latestNews.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section deep-coverage">
          <h2 className="section-title">Deep Coverage</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {deepCoverage.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/latest-news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section google-ad">
          <h3>Google Ad 1</h3>
          <div className="ad-placeholder">Ad Placeholder</div>
        </div>
      </div>

      {/* Rest of the rows ... */}
      <div className="sections-row">
        <div className="section latest-news">
          <h2 className="section-title">Latest EE Products</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {latestProducts.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section deep-coverage">
          <h2 className="section-title">Design Articles</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {designArticles.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/latest-news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section google-ad">
          <h3>Google Ad 1</h3>
          <div className="ad-placeholder">Ad Placeholder</div>
        </div>
      </div>

      <div className="sections-row">
        <div className="section latest-news">
          <h2 className="section-title">Careers & Education</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {latestNews.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section deep-coverage">
          <h2 className="section-title">India Semiconductor</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {deepCoverage.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/latest-news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section google-ad">
          <h3>Google Ad 1</h3>
          <div className="ad-placeholder">Ad Placeholder</div>
        </div>
      </div>


      <div className="sections-row">
        <div className="section latest-news">
          <h2 className="section-title">Design Guide</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {latestNews.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section deep-coverage">
          <h2 className="section-title">Most viewed</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {deepCoverage.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/latest-news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section google-ad">
          <h3>Google Ad 1</h3>
          <div className="ad-placeholder">Ad Placeholder</div>
        </div>
      </div>


      <div className="sections-row">
        <div className="section latest-news">
          <h2 className="section-title">Component Engineering</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {latestNews.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section deep-coverage">
          <h2 className="section-title">EE Herald's Video Stories</h2>
          <div className="black-bar"></div>
          <div className="article-list">
            {deepCoverage.map((article, index) => (
              <ArticlePreview
                key={index}
                title={article["Article Title"] || placeHolderTitle}
                description={article["Description"]}
                image={article.image || placeholderImage}
                date={article["Date of Publication"]}
                route={`/article/${article['ID']}`}
              />
            ))}
          </div>
          <a href="/latest-news" style={{ color: 'purple' }}>Read More</a>
        </div>

        <div className="section google-ad">
          <h3>Google Ad 1</h3>
          <div className="ad-placeholder">Ad Placeholder</div>
        </div>
      </div>


      
    </div>
  );
};

// Reusable component for article previews
const ArticlePreview = ({ title, description, image, date, route }) => {
  const formattedDate = formatDate(date);
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(route);
  };
  return (
    <div className="article-preview-row" onClick={handleNavigation}>
      <img src={image} alt={title} className="article-image-small" />
      <div className="article-details">
        <div className="article-date">{formattedDate}</div>
        <div className="article-title">{title}</div>
        <div className="description-two-lines">{description}</div>
      </div>
    </div>
  );
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default Home;
