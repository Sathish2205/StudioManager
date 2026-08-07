import { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', icon: 'pi pi-home' },
    { label: 'Studio', icon: 'pi pi-camera' },
    { label: 'Gallery', icon: 'pi pi-images' },
    { label: 'Pricing', icon: 'pi pi-tag' },
    { label: 'Contact', icon: 'pi pi-envelope' },
  ]

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        {/* Logo */}
        <div className="header__logo">
          <div className="header__logo-icon">
            <i className="pi pi-camera" />
          </div>
          <div className="header__logo-text">
            <span className="header__logo-name">PhotoStudio</span>
            <span className="header__logo-tag">PRO</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="header__nav">
          {navLinks.map((link) => (
            <a key={link.label} href="#" className="header__nav-link">
              <i className={link.icon} />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="header__actions">
          <Button
            icon="pi pi-search"
            rounded
            text
            className="header__icon-btn"
            aria-label="Search"
          />
          <Button
            icon="pi pi-bell"
            rounded
            text
            className="header__icon-btn"
            aria-label="Notifications"
          />
          <Button
            label="Get Started"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="header__cta-btn"
            rounded
          />
        </div>

        {/* Mobile Toggle */}
        <button
          className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`header__mobile-menu ${menuOpen ? 'header__mobile-menu--open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href="#"
            className="header__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            <i className={link.icon} />
            <span>{link.label}</span>
          </a>
        ))}
        <div className="header__mobile-actions">
          <Button
            label="Get Started"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="header__cta-btn header__cta-btn--full"
            rounded
          />
        </div>
      </div>
    </header>
  )
}
