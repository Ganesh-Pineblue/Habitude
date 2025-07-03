import React, { useState } from 'react';

const generations = [
  'Gen Z (1997-2012)',
  'Millennial (1981-1996)',
  'Gen X (1965-1980)',
  'Baby Boomer (1946-1964)',
  'Other',
];

export const GetToKnowForm = () => {
  const [generation, setGeneration] = useState('');
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // You can handle the collected data here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4 py-8">
      <div className="w-full max-w-xl bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col gap-8">
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 text-center mb-2">
          Let's Get To Know Each Other! <span role="img" aria-label="Handshake">🤝</span>
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Question 1 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-200 shadow-sm">
            <span className="text-3xl">🎯</span>
            <div className="flex-1">
              <label className="block text-green-900 font-medium mb-1">
                Pick your generation so I can understand you better!
              </label>
              <select
                className="w-full h-10 px-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white text-green-900 text-sm outline-none transition"
                value={generation}
                onChange={e => setGeneration(e.target.value)}
                required
              >
                <option value="" disabled>Select your generation</option>
                {generations.map((gen) => (
                  <option key={gen} value={gen}>{gen}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Question 2 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-200 shadow-sm">
            <span className="text-3xl">💬</span>
            <div className="flex-1">
              <label className="block text-green-900 font-medium mb-1">
                How would you like me to refer to you?
              </label>
              <input
                type="text"
                className="w-full h-10 px-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white text-green-900 text-sm outline-none transition"
                placeholder="Enter your preferred name"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl mt-2"
          >
            Continue
          </button>
          {submitted && (
            <div className="text-green-700 text-center mt-2 font-medium">
              Thank you, {nickname || 'friend'}!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GetToKnowForm; 