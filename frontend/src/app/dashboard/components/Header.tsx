type HeaderProps = {
  onLogout: () => void;
};

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="h-16 border-b border-[#E5E5E5] flex items-center px-6">
      <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center">
        <h1 className="text-[15px] font-medium text-black">Teomed App</h1>
        <button
          onClick={onLogout}
          className="text-[15px] text-[#666666] hover:text-black transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
