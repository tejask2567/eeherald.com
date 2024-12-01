import React, { useState } from "react";
import { 
  FileText, 
  Link, 
  Calendar, 
  Image as ImageIcon, 
  Tag, 
  Lock, 
  Plus,
  AlertCircle,
  Loader
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import "./Dashboard.css"

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [articleType, setArticleType] = useState("isFree");
  const [newsType, setNewsType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleNewsTypeChange = (value) => {
    setNewsType((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/admin/addNewsArticle", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          date,
          sourceUrl,
          imageUrl,
          articleType,
          newsType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add article');
      }

      setSuccess("Article added successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setSourceUrl("");
      setImageUrl("");
      setArticleType("isFree");
      setNewsType([]);
    } catch (error) {
      setError(error.message || "Error adding article");
    } finally {
      setIsLoading(false);
    }
  };

  const newsCategories = [
    "Automotive",
    "India Semiconductor",
    "Student",
    "Technology",
    "Business",
    "Science"
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1><FileText className="icon" />Add News Article</h1>
      </header>

      {error && (
        <div className="alert error">
          <AlertCircle className="icon" />
          {error}
        </div>
      )}

      {success && (
        <div className="alert success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label>
            <FileText className="icon" /> Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            required
          />
        </div>

        <div className="form-group editor-container">
          <label>
            <FileText className="icon" /> Description
          </label>
          <Editor
            apiKey="3ug0brbgzksyhophsbikidh8pjpkwyo89vhl9xzi24as15jh"
            value={description}
            onEditorChange={(content) => setDescription(content)}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
              skin: 'oxide',
              branding: false,
            }}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <Calendar className="icon" /> Publication Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Link className="icon" /> Source URL
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <ImageIcon className="icon" /> Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
          />
          {imageUrl && (
            <div className="image-preview">
              <img src={imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <Lock className="icon" /> Article Type
            </label>
            <select
              value={articleType}
              onChange={(e) => setArticleType(e.target.value)}
              required
            >
              <option value="isFree">Free</option>
              <option value="isLoginRequired">Login Required</option>
              <option value="isSubscriptionRequired">Subscription Required</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <Tag className="icon" /> News Categories
            </label>
            <div className="checkbox-group">
              {newsCategories.map((category) => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={category}
                    checked={newsType.includes(category)}
                    onChange={() => handleNewsTypeChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="icon spin" /> Adding Article...
            </>
          ) : (
            <>
              <Plus className="icon" /> Add Article
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;