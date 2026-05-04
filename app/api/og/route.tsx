import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title =
    searchParams.get("title") || "Naiara Colin Espaço de Beleza";
  const cover = searchParams.get("cover");

  if (cover) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            backgroundImage: `linear-gradient(rgba(10,10,10,0.55), rgba(10,10,10,0.85)), url(${cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: 48,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontFamily: "Georgia, serif",
              color: "#C9A84C",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          padding: 48,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontFamily: "Georgia, serif",
            color: "#C9A84C",
            textAlign: "center",
          }}
        >
          Naiara Colin
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            fontFamily: "Georgia, serif",
            color: "#C9A84C",
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          {title}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
