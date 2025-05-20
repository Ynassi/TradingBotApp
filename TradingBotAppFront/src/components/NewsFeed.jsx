import React from 'react';

export default function NewsFeed({ articles = [] }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">Actualités financières du jour</h2>
      <ul className="space-y-3">
        {articles.map((article, idx) => (
          <li key={idx}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline"
            >
              {article.headline}
            </a>
            {article.sentiment && (
              <span
                className={`ml-2 text-xs font-semibold ${
                  article.sentiment > 0
                    ? 'text-green-400'
                    : article.sentiment < 0
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }`}
              >
                {article.sentiment > 0 ? 'Haussier' : article.sentiment < 0 ? 'Baissier' : 'Neutre'}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}