
export default function Video() {
    return (
        <video
            className={`rounded-xl w-full h-auto shadow-2xl`}
            autoPlay
            muted
            loop
            playsInline
        >
            <source src="/assets/videos/Vid001.mp4" type="video/mp4" />
        </video>
    )
}