'use client';

import { SourceCitation } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useState } from 'react';

interface CitationCardProps {
  source: SourceCitation;
  index: number;
}

export default function CitationCard({ source, index }: CitationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(source.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewDocument = () => {
    window.open(`/documents/${source.documentId}?page=${source.pageNumber}`, '_blank');
  };

  return (
    <div className="group p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg border border-gray-200/60 dark:border-gray-700/60 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
              {source.documentName}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                P.{source.pageNumber}
              </span>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  source.score > 0.8 ? 'bg-green-400' : 
                  source.score > 0.6 ? 'bg-yellow-400' : 'bg-orange-400'
                }`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(source.score * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs font-mono text-gray-400 dark:text-gray-500 opacity-60">
            #{index + 1}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Copy trích dẫn"
            >
              {copied ? (
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleViewDocument}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Mở tài liệu"
            >
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Compact Content Preview */}
      <blockquote className="border-l-2 border-blue-300 dark:border-blue-600 pl-3 py-1">
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic line-clamp-2">
          &quot;{source.content}&quot;
        </p>
      </blockquote>
    </div>
  );
}