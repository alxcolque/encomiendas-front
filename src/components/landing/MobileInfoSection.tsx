export default function MobileInfoSection() {
    return (
        <div className="w-full px-6 py-8 pb-32">
            <div className="flex flex-row justify-between items-start gap-4">
                {/* Text Section */}
                <div className="flex-1 pt-4">
                    <h2 className="text-2xl font-bold text-orange-600 leading-tight">
                        Descripción
                        <br />
                        de Negocio
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Soluciones logísticas rápidas y seguras para tu empresa.
                    </p>
                </div>

                {/* Image Placeholder Box */}
                <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-orange-400 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <span className="text-gray-300 font-bold text-xl select-none">Imagen</span>
                </div>
            </div>
        </div>
    );
}
