const Cast = ({ image, castName, role }) => {
  return (
    <div className="m-2">
      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden">
        <img src={image} alt={castName} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-sm mt-2 font-semibold">{castName}</h3>
      <p className="text-xs text-gray-600">{role}</p>
    </div>
  );
};

export default Cast;
