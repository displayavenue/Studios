import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { computerFundamentalsCourse as course } from "../data/academy/computer-fundamentals";
import "./Page.css";

export function AcademyCourse() {
  return (
    <div>
      <SEO
        title={`${course.title} | DisplayAvenue Academy`}
        description={course.subtitle}
        path={`/academy/courses/${course.slug}`}
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>/</span><Link to="/academy">Academy</Link><span>/</span><span>Course</span>
          </nav>
          <p className="eyebrow">DisplayAvenue Academy</p>
          <h1>{course.title}</h1>
          <p>{course.subtitle}</p>
          <div className="academy-meta">
            <span>{course.level}</span><span>{course.duration}</span><span>100-question final exam</span><span>{course.passingScore}% pass mark</span>
          </div>
          <div className="academy-hero-actions">
            <strong>₹{course.price.toLocaleString("en-IN")}</strong>
            <button className="button button-primary" type="button">Buy Course</button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What you will learn</p>
            <h2>A complete beginner-to-confident computer curriculum</h2>
          </div>
          <div className="academy-module-grid">
            {course.modules.map((module, index) => (
              <article className="card academy-module-card" key={module.title}>
                <span className="academy-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{module.title}</h3>
                <p>{module.objective}</p>
                <ul>
                  {module.lessons.map((lesson) => <li key={lesson.title}>{lesson.title}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container academy-two-col">
          <div>
            <p className="eyebrow">Practical assignments</p>
            <h2>Learn by doing</h2>
            <p>Students complete real-world computer tasks instead of only watching videos.</p>
          </div>
          <div className="academy-checklist">
            {course.practicalAssignments.map((assignment, index) => <div key={assignment}><b>{index + 1}</b><span>{assignment}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container academy-two-col">
          <div>
            <p className="eyebrow">Certification</p>
            <h2>Complete the exam and earn your certificate</h2>
            <p>The final examination contains 100 questions. A score of {course.passingScore}% or higher qualifies the learner for automatic certificate issuance.</p>
          </div>
          <div className="card academy-certificate-card">
            <p className="certificate-brand">DISPLAYAVENUE ACADEMY</p>
            <h3>{course.certificate.title}</h3>
            <p>This certifies that</p>
            <strong>STUDENT NAME</strong>
            <p>has successfully completed</p>
            <b>{course.certificate.course}</b>
            <hr />
            <small>Certificate ID: DA-CBS-XXXXXXXX</small>
            <small>Verify online after issuance</small>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Final exam blueprint</p>
            <h2>100 questions • 70% required</h2>
          </div>
          <div className="academy-exam-grid">
            {course.finalExamBlueprint.sections.map((section) => <div className="card" key={section.name}><strong>{section.name}</strong><span>{section.questions} questions</span></div>)}
          </div>
          <p className="academy-note">Certificate issuance is designed to be automated after lesson completion and a passing final score. Payment processing, student accounts, progress tracking, question randomization and certificate PDF generation can be connected to the site's backend/CMS before launch.</p>
        </div>
      </section>
    </div>
  );
}
