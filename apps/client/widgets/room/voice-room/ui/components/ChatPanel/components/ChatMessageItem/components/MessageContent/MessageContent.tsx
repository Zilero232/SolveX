'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { messageContentStyles as s } from './MessageContent.styles';
import type { Components } from 'react-markdown';
import type { MessageContentProps } from './MessageContent.types';

const components: Components = {
  a: ({ href, children }) => (
    <a className={s.link} href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  ),
  code: ({ children }) => <code className={s.code}>{children}</code>,
  pre: ({ children }) => <pre className={s.pre}>{children}</pre>,
};

export const MessageContent = ({ message }: MessageContentProps) => {
  return (
    <div className={s.root}>
      <Markdown components={components} remarkPlugins={[remarkGfm]}>
        {message}
      </Markdown>
    </div>
  );
};
