export const SectionWrapper = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) => (
  <section {...props} className={`py-16 ${props.className || ""}`}>
    {children}
  </section>
);
