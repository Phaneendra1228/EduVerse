import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">Edu<span>Verse</span></Link>
            <p>Empowering learners worldwide with innovative education, cutting-edge technology, and personalized learning paths for a brighter future.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/courses">Courses</Link></li>
              <li><Link href="/career">Career Guidance</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link href="/meetings">Meetings</Link></li>
              <li><Link href="/resume">Resume Builder</Link></li>
              <li><Link href="/dossier">Dossier</Link></li>
              <li><Link href="/profile">Profile</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li><i className="fas fa-phone"></i> +91 98765 43210</li>
              <li><i className="fas fa-envelope"></i> contact@eduverse.com</li>
              <li><i className="fas fa-map-marker-alt"></i> Hyderabad, India</li>
              <li><i className="fas fa-globe"></i> www.eduverse.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 EduVerse. All Rights Reserved.</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
