type Application = {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
};

type ApplicationCardProps = {
  application: Application;
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <div
      key={application.id}
      className="p-6 bg-white border border-[#E5E5E5] rounded-lg hover:border-[#0066FF] transition-colors"
    >
      <h3 className="text-[17px] font-medium text-black mb-1">{application.name}</h3>
      <p className="text-[15px] text-[#666666] mb-4">{application.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-[#666666]">
          {new Date(application.createdAt).toLocaleDateString('pt-BR')}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-[13px] ${application.status === 'active' ? 'bg-[#E3F2E6] text-[#1C7A2C]' : 'bg-[#FFF4E5] text-[#B25D05]'}`}
        >
          {application.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </div>
    </div>
  );
}
