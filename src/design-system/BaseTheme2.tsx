import { Category2 } from "iconsax-react";

const BaseTheme2 = () => {
  return (
    <div className="p-8">
      <div>
        <h2 className="text-h2">TYPOGRAPHY</h2>
        {/* HEADINGS ---------------------------------------------------------------- */}
        <section className="m-4">
          <h3 className="text-h3">HEADINGS -----------</h3>

          <h1 className="text-h1">This is H1</h1>
          <h2 className="text-h2">This is H2</h2>
          <h3 className="text-h3">This is H3</h3>
          <h4 className="text-h4">This is H4</h4>
          <h5 className="text-h5">This is H5</h5>
          <h6 className="text-h6">This is H6</h6>
        </section>

        {/* BODY ---------------------------------------------------------------- */}
        <section className="m-4">
          <h3 className="text-h3">BODY -----------</h3>
          <p className="text-body-big-reg">Big Regular Paragraph</p>
          <p className="text-body-base-reg">Base Regular Paragraph</p>
          <p className="text-body-small-reg">Small Regular Paragraph</p>
          <br />
          <p className="text-body-big-strong">Big Strong Paragraph</p>
          <p className="text-body-base-strong">Base Strong Paragraph</p>
          <p className="text-body-small-strong">Small Strong Paragraph</p>
        </section>

        {/* CAPTIONS ---------------------------------------------------------------- */}
        <section className="m-4">
          <h3 className="text-h3">CAPTIONS -----------</h3>
          <p className="text-caption-reg">
            This is a regular caption with medium font weight (Poppins).
          </p>
          <p className="text-caption-strong">
            This is a strong caption (DM Sans Bold).
          </p>
          <p className="text-caption-all-caps">
            ALL CAPS SMALL CAPTION (DM Sans Bold, uppercase, 12% letter
            spacing).
          </p>
        </section>

        {/* ICONS ---------------------------------------------------------------- */}
        <section className="m-4">
          <h3 className="text-h3">ICONS -----------</h3>
          <div className="m-2 flex flex-wrap gap-1">
            <Category2 variant="Bold" className="icon icon-sm text-error700" />
            <Category2
              variant="Bold"
              className="icon icon-md text-szSecondary500 "
            />
            <Category2
              variant="Bold"
              className="icon icon-lg text-szPrimary500"
            />
          </div>
        </section>

        {/* BORDERS ---------------------------------------------------------------- */}
        <section className="m-4 flex flex-col gap-4">
          <h3 className="text-h3">BORDERS -----------</h3>
          <div className="rounded-custom-lg shadow-custom-dark p-2 bg-szSecondary200 w-40 h-40 flex flex-wrap gap-1 justify-center items-center">
            Card with dark shadow
          </div>
          <div className="rounded-custom-md shadow-custom-light p-2 bg-szSecondary200 w-40 h-40 flex flex-wrap gap-1 justify-center items-center">
            Input with light shadow
          </div>
        </section>
      </div>
    </div>
  );
};

export default BaseTheme2;
