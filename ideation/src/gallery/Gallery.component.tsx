import Photo from "./Photo.component";

const photosByDate = [
  {
    date: "2024-05-01",
    photos: ["./logo.png", "./logo.png", "./logo.png", "./logo.png"],
  },
  {
    date: "2024-04-30",
    photos: ["./logo.png", "./logo.png"],
  },
];

export default function Gallery() {
  return (
    <div className="flex flex-wrap flex-col justify-between gap-8">
      {photosByDate.map((entry) => (
        <div key={entry.date} className="max-w-md w-full mx-auto">
          <h2 className="text-2xl mb-4">{entry.date}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-between">
            {entry.photos.map((photo, index) => (
              <Photo key={index} photo={photo} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
