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
    <div className="flex-1 px-10 py-8 bg-gray-50 h-full">
      <div className={`w-full h-full ${className}`}>{children}</div>
    </div>
  );
};

export default ContainerWrapper;
