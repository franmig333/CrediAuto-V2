import { useContent } from '../../context/ContentContext';

export const DeliveryGallery = () => {
    const { gallery } = useContent();

    return (
        <div className="px-4 mb-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full"></span>
                Últimas Entregas
            </h2>

            <div className="grid grid-cols-2 gap-3">
                {gallery.map((item) => (
                    <div key={item.id} className="relative group overflow-hidden rounded-xl aspect-square">
                        <img
                            src={item.image}
                            alt={item.caption}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <span className="text-xs text-white font-medium">{item.caption}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
