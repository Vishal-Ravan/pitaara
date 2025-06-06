import styles from "./AboutDiscount.module.css";
import Image from "next/image";

export const AboutDiscount = () => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.sectionGrid}>
        <div className={styles.textBlock}>
          <h3>So... who are we?</h3>
          <p>
            Say hello to <span className={styles.highlight}>Pittara</span> —
            your sassiest, sparkliest jewellery BFF. Born from the idea of a
            hidden treasure (yes, <strong>pittara</strong> literally means a box
            of treasures), we wanted to give you the kind of pieces that don’t
            just sit pretty in your drawer — they <em>SHOW UP</em> with you.
          </p>
          <p>
            Whether you're dressing up for a brunch date or slaying a Zoom call,{" "}
            <span className={styles.highlight}>Pittara’s got your sparkle</span>
            , no touch-ups needed.
          </p>
          <p>
            Tired of cute pieces that die after 2 wears?{" "}
            <strong>Come thru, bestie. 💁‍♀️</strong>
          </p>
          <p>
            <strong>PITTARA’s got your back</strong> (and your ears, fingers,
            neck, wrists...). Jewellery that loves you back —{" "}
            <span className={styles.highlightPink}>
              it's giving forever. It’s giving PITTARA.
            </span>
          </p>
        </div>
        <div className={styles.imageBlock}>
          <img
            src="https://cdn.shopify.com/s/files/1/0145/1684/6692/files/our-story-1.jpg?4316131069318019975"
            alt="Founders"
            className={styles.image}
          />
        </div>
      </section>

      <section className={styles.another}>
        <div className={styles.imageBlock}>
          <img
            src="https://cdn.shopify.com/s/files/1/0145/1684/6692/files/our-story-1.jpg?4316131069318019975"
            alt="Founders"
            className={styles.image}
          />
        </div>
        <div className={styles.expectSection}>
          <h3>What to Expect When You Shop?</h3>
          <ul>
            <li>✔️ Insta-worthy packaging</li>
            <li>✔️ Pieces that don’t flake on you</li>
            <li>✔️ A jewellery stash that slaps harder than your playlist</li>
          </ul>
        </div>
      </section>


      <section className={styles.sectionGrid}>
        <div className={styles.textBlock}>
          <h3>OUR VALUES</h3>
          <div className={styles.valueGrid}>
            <div className={styles.valueBox}>
              <span>01</span>
              <div>
                <h5>Stay Sassy, Stay Classy</h5>
                <p>
                  At Pittara, we believe in fearless creativity and honest
                  craftsmanship. We challenge norms, break the mould, and always
                  do what's right—for our people, our planet, and your sparkle.
                </p>
              </div>
            </div>
            <div className={styles.valueBox}>
              <span>02</span>
              <div>
                <h5>Glow Up, Every Day</h5>
                <p>
                  From design to durability, we never settle. Each day, we
                  refine our craft, elevate our quality, and innovate so your
                  jewellery—and your confidence—never lose their shine.
                </p>
              </div>
            </div>
            <div className={styles.valueBox}>
              <span>03</span>
              <div>
                <h5>Shine for Your Tribe</h5>
                <p>
                  You are the heart of our treasure box. We listen, we care, and
                  we design with you in mind—because you deserve jewellery that
                  keeps up with your life and style
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.imageBlock}>
          <img
            src="https://cdn.shopify.com/s/files/1/0145/1684/6692/files/our-story-1.jpg?4316131069318019975"
            alt="Founders"
            className={styles.image}
          />
        </div>
      </section>

 <section className={styles.another}>
        <div className={styles.imageBlock}>
          <img
            src="https://cdn.shopify.com/s/files/1/0145/1684/6692/files/our-story-1.jpg?4316131069318019975"
            alt="Founders"
            className={styles.image}
          />
        </div>
        <div className={styles.expectSection}>
          <h3>Our Vision</h3>
          <div className={styles.line}></div>
          <p>
            To become the ultimate sparkle squad for every mood, look, and
            moment. Jewellery that stays good—no matter how wild life gets.
          </p>
          <p>
            With Pittara, you’ll never hear, “Ugh, it’s turned black.” Only,
            “OMG where did you get that?!”
          </p>
        </div>
      </section>
    

        <section className={styles.sectionGrid}>
        <div className={styles.textBlock}>
          
            <h3>Our Mission</h3>
          <p>
            To celebrate self-expression through jewellery that’s bold,
            beautiful, and unapologetically you. At Pittara, we’re here to turn
            everyday moments into little celebrations—whether you're power
            dressing, brunch hopping, or just vibing in your PJs.
          </p>
          <p>
            Our collection includes pieces that let your personality pop, your
            confidence glow, and your style shine—day in, day out. Because
            you're not basic, and your jewellery shouldn't be either.
          </p>
        </div>
        <div className={styles.imageBlock}>
          <img
            src="https://cdn.shopify.com/s/files/1/0145/1684/6692/files/our-story-1.jpg?4316131069318019975"
            alt="Founders"
            className={styles.image}
          />
        </div>
      </section>
    </div>
  );
};
