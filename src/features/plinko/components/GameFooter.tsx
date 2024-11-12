import settings from "@/assets/settings.svg";

export const GameFooter = () => {
  return (
    <footer className=" w-full h-[44px] flex items-center justify-between border-t border-primary-gray px-6">
      <div>
        <img src={settings} alt="settings" width={20} height={20} />
      </div>
      <p className=" font-bold text-[18px]">
        The<span className=" text-rose-500">Project</span>
      </p>
      <p className="text-[14px]">Fairness</p>
    </footer>
  );
};
