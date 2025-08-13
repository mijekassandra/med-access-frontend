interface ContainerWrapperProps {
  children: React.ReactNode;
}

interface ContainerWrapperProps {
  className?: string;
}

const ContainerWrapper: React.FC<ContainerWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div className="flex-1 min-h-full px-4 py-6 bg-gray-50 sm:py-6 sm:px-8 flex flex-col">
      <div className={`w-full flex-1 ${className}`}>{children}</div>
    </div>
  );
};

export default ContainerWrapper;
