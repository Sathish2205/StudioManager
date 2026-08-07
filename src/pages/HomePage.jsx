import './HomePage.css'

export default function HomePage() {
  const features = [
    {
      icon: 'pi pi-sparkles',
      title: 'AI Enhancement',
      desc: 'Automatically enhance colors, lighting, and composition with one click.',
    },
    {
      icon: 'pi pi-objects-column',
      title: 'Layer System',
      desc: 'Professional non-destructive editing with unlimited layers and masks.',
    },
    {
      icon: 'pi pi-cloud-upload',
      title: 'Cloud Sync',
      desc: 'Seamlessly sync your projects across all your devices in real-time.',
    },
    {
      icon: 'pi pi-share-alt',
      title: 'Easy Export',
      desc: 'Export in any format — PNG, JPEG, WebP, TIFF — with batch processing.',
    },
  ]

  const workflows = [
    {
      step: '01',
      title: 'Import',
      desc: 'Drag & drop your photos or import from your camera roll.',
      icon: 'pi pi-upload',
    },
    {
      step: '02',
      title: 'Edit',
      desc: 'Use AI-powered tools or manual adjustments to perfect your shot.',
      icon: 'pi pi-sliders-h',
    },
    {
      step: '03',
      title: 'Enhance',
      desc: 'Apply cinematic filters, retouch portraits, and adjust tones.',
      icon: 'pi pi-palette',
    },
    {
      step: '04',
      title: 'Export',
      desc: 'Save in any format at any resolution — ready to share or print.',
      icon: 'pi pi-download',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Fashion Photographer',
      text: 'PhotoStudio Pro has completely transformed my post-processing workflow. The AI tools save me hours every week.',
      avatar: 'SC',
    },
    {
      name: 'Marcus Rivera',
      role: 'Wedding Photographer',
      text: 'The batch processing alone is worth it. I can edit an entire wedding shoot in a fraction of the time.',
      avatar: 'MR',
    },
    {
      name: 'Emma Brooks',
      role: 'Content Creator',
      text: 'The most intuitive photo editor I have ever used. My Instagram feed has never looked better!',
      avatar: 'EB',
    },
  ]

  return (
    <main className="home">
      {/* ─── Hero Section ─── */}
      <section className="hero" id="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid-overlay" />
        </div>

        <div className="hero__content">
          <span className="hero__badge">✨ #1 Photo Editor of 2026</span>

          <h1 className="hero__title">
            Capture Moments,
            <br />
            <span className="hero__title-accent">Create Masterpieces</span>
          </h1>

          <p className="hero__subtitle">
            A next-generation photo editing studio powered by AI. Transform your
            creative vision into stunning reality with professional-grade tools.
          </p>

          <div className="hero__actions">
            <button className="btn btn--primary btn--lg">
              Start Editing Free <i className="pi pi-arrow-right" />
            </button>
            <button className="btn btn--outline btn--lg">
              <i className="pi pi-play" /> Watch Demo
            </button>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-number">250K+</span>
              <span className="hero__stat-label">Active Users</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">50+</span>
              <span className="hero__stat-label">AI Filters</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">4.9</span>
              <span className="hero__stat-label">User Rating</span>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="hero__floating-cards">
          <div className="hero__float-card hero__float-card--1">
            <i className="pi pi-image" />
            <span>Smart Crop</span>
          </div>
          <div className="hero__float-card hero__float-card--2">
            <i className="pi pi-palette" />
            <span>Color AI</span>
          </div>
          <div className="hero__float-card hero__float-card--3">
            <i className="pi pi-bolt" />
            <span>Instant Edit</span>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="features" id="features">
        <div className="features__inner">
          <span className="section__badge"><i className="pi pi-star" /> Features</span>
          <h2 className="features__heading">
            Why <span className="features__heading-accent">PhotoStudio Pro</span>?
          </h2>
          <p className="features__subheading">
            Everything you need to bring your photos to life — all in one place.
          </p>

          <div className="features__grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card">
                <div className="feature-card__icon">
                  <i className={feature.icon} />
                </div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.desc}</p>
                <div className="feature-card__shine" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works Section ─── */}
      <section className="workflow" id="workflow">
        <div className="workflow__inner">
          <span className="section__badge"><i className="pi pi-sync" /> How It Works</span>
          <h2 className="workflow__heading">
            From Photo to <span className="workflow__heading-accent">Perfection</span>
          </h2>
          <p className="workflow__subheading">
            Four simple steps to transform any photo into a professional masterpiece.
          </p>

          <div className="workflow__steps">
            {workflows.map((item) => (
              <div key={item.step} className="workflow-step">
                <div className="workflow-step__number">{item.step}</div>
                <div className="workflow-step__icon">
                  <i className={item.icon} />
                </div>
                <h3 className="workflow-step__title">{item.title}</h3>
                <p className="workflow-step__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="testimonials" id="testimonials">
        <div className="testimonials__inner">
          <span className="section__badge"><i className="pi pi-heart" /> Testimonials</span>
          <h2 className="testimonials__heading">
            Loved by <span className="testimonials__heading-accent">Creators</span>
          </h2>
          <p className="testimonials__subheading">
            See what photographers and creators around the world are saying.
          </p>

          <div className="testimonials__grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="pi pi-star-fill" />
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="cta" id="cta">
        <div className="cta__inner">
          <div className="cta__bg-orb cta__bg-orb--1" />
          <div className="cta__bg-orb cta__bg-orb--2" />
          <div className="cta__content">
            <h2 className="cta__title">
              Ready to Create Something{' '}
              <span className="cta__title-accent">Amazing</span>?
            </h2>
            <p className="cta__text">
              Join 250,000+ photographers and creators who trust PhotoStudio Pro
              for their creative work. Start for free — no credit card required.
            </p>
            <div className="cta__actions">
              <button className="btn btn--primary btn--lg">
                Get Started Free <i className="pi pi-arrow-right" />
              </button>
              <button className="btn btn--outline btn--lg">
                <i className="pi pi-tag" /> View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__top">
            <div className="footer__brand">
              <div className="footer__logo">
                <div className="footer__logo-icon">
                  <i className="pi pi-camera" />
                </div>
                <div className="footer__logo-text">
                  <span className="footer__logo-name">PhotoStudio</span>
                  <span className="footer__logo-tag">PRO</span>
                </div>
              </div>
              <p className="footer__tagline">
                Professional photo editing, powered by AI.
              </p>
              <div className="footer__socials">
                <a href="#" className="footer__social" aria-label="Twitter">
                  <i className="pi pi-twitter" />
                </a>
                <a href="#" className="footer__social" aria-label="Instagram">
                  <i className="pi pi-instagram" />
                </a>
                <a href="#" className="footer__social" aria-label="GitHub">
                  <i className="pi pi-github" />
                </a>
                <a href="#" className="footer__social" aria-label="YouTube">
                  <i className="pi pi-youtube" />
                </a>
              </div>
            </div>

            <div className="footer__links-group">
              <h4 className="footer__links-title">Product</h4>
              <a href="#" className="footer__link">Features</a>
              <a href="#" className="footer__link">Pricing</a>
              <a href="#" className="footer__link">Changelog</a>
              <a href="#" className="footer__link">Roadmap</a>
            </div>

            <div className="footer__links-group">
              <h4 className="footer__links-title">Resources</h4>
              <a href="#" className="footer__link">Documentation</a>
              <a href="#" className="footer__link">Tutorials</a>
              <a href="#" className="footer__link">Blog</a>
              <a href="#" className="footer__link">Community</a>
            </div>

            <div className="footer__links-group">
              <h4 className="footer__links-title">Company</h4>
              <a href="#" className="footer__link">About</a>
              <a href="#" className="footer__link">Careers</a>
              <a href="#" className="footer__link">Contact</a>
              <a href="#" className="footer__link">Privacy</a>
            </div>
          </div>

          <div className="footer__bottom">
            <span className="footer__copyright">
              © 2026 PhotoStudio Pro. All rights reserved.
            </span>
            <div className="footer__bottom-links">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
