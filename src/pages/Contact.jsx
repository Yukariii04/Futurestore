import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 500);
  };

  return (
    <section className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-mono mb-2">
            CONTACT
          </p>
          <h1 className="text-4xl font-mono mb-8">Get in Touch</h1>
        </div>

        <div className="max-w-2xl">
          <div className="glass-strong rounded-lg p-8 border border-neutral-800">
            {submitted && (
              <div className="mb-6 p-4 bg-white/5 border border-green-500/50 rounded">
                <p className="text-sm font-mono text-green-400">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 font-mono mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 font-mono mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 font-mono mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 font-mono mb-2">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500 font-mono text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

