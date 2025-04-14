import Link from "next/link";

export const AboutDiscount = () => {
  return (
    <>
      <div class="wrapper">
        <h3 class="about-subtitle">So... who are we?</h3>
        <p class="about-text">
          Say hello to <span class="highlight">Pittara</span>—your sassiest,
          sparkliest jewellery BFF. Born from the idea of a hidden treasure
          (yes, <strong>pittara</strong> literally means a box of treasures), we
          wanted to give you the kind of pieces that don’t just sit pretty in
          your drawer — they <em>SHOW UP</em> with you.
        </p>
        <p class="about-text">
          So whether you’re dressing up for a brunch date or slaying a Zoom
          call, <span class="highlight">Pittara’s got your sparkle</span>, no
          touch-ups needed.
        </p>
        <p class="about-text">
          So if you're tired of buying cute pieces that die after 2 wears—{" "}
          <strong>come thru, bestie. 💁‍♀️</strong>
        </p>
        <p class="about-text">
          <strong>PITTARA’s got your back</strong> (and your ears, fingers,
          neck, wrists... you get the drift). Jewellery that loves you back —{" "}
          <span class="highlight-pink">
            it's giving forever. It’s giving PITTARA.
          </span>
        </p>

        <h3 class="what-expect">What to Expect When You Shop?</h3>
        <ul class="expect-list">
          <li>✔️ Insta-worthy packaging</li>
          <li>✔️ Pieces that don’t flake on you</li>
          <li>✔️ A jewellery stash that slaps harder than your playlist</li>
        </ul>
      </div>
      <div class="values-section  mt-5">
        <h2>OUR VALUES</h2>
        <div class="values-container">
          <div class="value-box box1">
            <div class="value-front">
              <span class="value-number">01</span>
              <h3>Stay Sassy, Stay Classy</h3>
            </div>
            <div class="value-hover">
              <p>
                At Pittara, we believe in fearless creativity and honest
                craftsmanship. We challenge norms, break the mould, and always
                do what's right—for our people, our planet, and your sparkle.
              </p>
            </div>
          </div>

          <div class="value-box box2">
            <div class="value-front">
              <span class="value-number">02</span>
              <h3> Glow Up, Every Day</h3>
            </div>
            <div class="value-hover">
              <p>
                From design to durability, we never settle. Each day, we refine
                our craft, elevate our quality, and innovate so your
                jewellery—and your confidence—never lose their shine.
              </p>
            </div>
          </div>

          <div class="value-box box3">
            <div class="value-front">
              <span class="value-number">03</span>
              <h3>
                Shine for <br />
                Your Tribe
              </h3>
            </div>
            <div class="value-hover">
              <p>
                You are the heart of our treasure box. We listen, we care, and
                we design with you in mind—because you deserve jewellery that
                keeps up with your life and style
              </p>
            </div>
          </div>
        </div>
      </div>
      <section class="vision-mission-section">
        <div class="container">
          <div class="card">
            <h3>Our Vision</h3>
            <span class="underline"></span>
            <p>
              To become the ultimate sparkle squad for every mood, look, and
              moment. We dream of a world where your go-to jewellery doesn’t
              just look good but stays good—no matter how wild life gets.
            </p>

            <p>
              With Pittara, you’ll never hear, “Ugh, it’s turned black.” Only,
              “OMG where did you get that?!”
            </p>
          </div>
          <div class="card">
            <h3>Our Mission</h3>
            <span class="underline"></span>
            <p>
              To celebrate self-expression through jewellery that’s bold,
              beautiful, and unapologetically you. At Pittara, we’re here to
              turn everyday moments into little celebrations—whether you're
              power dressing, brunch hopping, or just vibing in your PJs.
            </p>
            <p>
              Our collection includes pieces that let your personality pop, your
              confidence glow, and your style shine—day in, day out. Because
              you're not basic, and your jewellery shouldn't be either.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
