export function Card ({
  className,
  title,
  children,
  href,
}:{
  className?: string;
  title: string;
  childre: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <a
      className={className}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2 className="text-sm">
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}