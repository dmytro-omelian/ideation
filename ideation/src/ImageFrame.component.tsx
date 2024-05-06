export interface ImageFrameProps {
  image: any;
}

export default function ImageFrame({ image }: ImageFrameProps) {
  return (
    <div>
      <div>
        <img src={image} alt={`Slide 1`} className="image-preview" />
      </div>
    </div>
  );
}
