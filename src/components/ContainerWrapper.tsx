interface ContainerWrapperProps {
  children: React.ReactNode;
}

const ContainerWrapper: React.FC<ContainerWrapperProps> = ({ children }) => {
  return (
    <div className="flex-1 px-10 py-8 bg-gray-50 h-full">
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default ContainerWrapper;
