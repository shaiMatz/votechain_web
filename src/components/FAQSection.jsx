import useGsapAnimation from '../hooks/useGsapAnimation';

const FAQSection = () => {
  const faqRef = useGsapAnimation({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 1 },
  });

  return (
    <section ref={faqRef} className="text-center p-8 bg-gray-50">
      <h2 className="text-4xl font-bold mb-6 text-primary">FAQ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-2 text-secondary">Question 1</h3>
          <p>Answer to question 1.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-2 text-secondary">Question 2</h3>
          <p>Answer to question 2.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-2 text-secondary">Question 3</h3>
          <p>Answer to question 3.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-2 text-secondary">Question 4</h3>
          <p>Answer to question 4.</p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
