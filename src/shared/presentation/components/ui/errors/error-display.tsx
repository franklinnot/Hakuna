import { ErrorResponse } from '../../../../application/response';
import { SpanError } from './span-error';
import { extractErrors } from '../../../../application/lib/cast-errors';

export const ErrorDisplay = ({ error }: { error: ErrorResponse }) => {
  const messages = extractErrors(error);

  if (messages.length == 0) {
    return null;
  }

  if (messages.length == 1) {
    return <SpanError error={messages[0]} />;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {messages.map((msg, index) => (
        <SpanError key={index} error={msg} />
      ))}
    </div>
  );
};
