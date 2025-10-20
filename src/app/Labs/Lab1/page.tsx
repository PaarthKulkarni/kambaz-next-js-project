"use client";

export default function Lab1() {
  return (
    <div id="wd-lab1" className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lab 1</h2>
      <h3 className="text-xl font-semibold mb-3">HTML Examples</h3>

      {/* Headings */}
      <div id="wd-h-tag" className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Heading Tags</h4>
        <p>
          Text documents are often broken up into several sections and
          subsections. Each section is usually prefaced with a short title or
          heading that attempts to summarize the topic of the section it
          precedes. For instance, this paragraph is preceded by the heading
          "Heading Tags." The font of the section headings is usually larger
          and bolder than their subsection headings. This document uses headings
          to introduce topics such as HTML Documents, HTML Tags, Heading Tags,
          etc. HTML heading tags can be used to format plain text so that it
          renders in a browser as large headings. There are 6 heading tags for
          different sizes: h1, h2, h3, h4, h5, and h6. Tag h1 is the largest
          heading and h6 is the smallest heading.
        </p>
      </div>

      {/* Paragraphs */}
      <div id="wd-p-tag" className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Paragraph Tag</h4>
        <p id="wd-p-1" className="mb-2">
          This is the first paragraph. The paragraph tag is used to format
          vertical gaps between long pieces of text like this one.
        </p>
        <p id="wd-p-2" className="mb-2">
          This is the second paragraph. Even though there is a deliberate white
          gap between the paragraph above and this paragraph, by default
          browsers render them as one contiguous piece of text as shown here.
        </p>
        <p id="wd-p-3" className="mb-2">
          This is the third paragraph. Wrap each paragraph with the paragraph
          tag to tell browsers to render the gaps.
        </p>
      </div>

      {/* Lists */}
      <div id="wd-lists" className="mb-6">
        <h4 className="text-lg font-semibold mb-2">List Tags</h4>

        <h5 className="font-medium mt-4 mb-1">Ordered List Tag</h5>
        <p className="mb-1">How to make pancakes:</p>
        <ol id="wd-pancakes" className="list-decimal list-inside mb-4">
          <li>Mix dry ingredients.</li>
          <li>Add wet ingredients.</li>
          <li>Stir to combine.</li>
          <li>Heat a skillet or griddle.</li>
          <li>Pour batter onto the skillet.</li>
          <li>Cook until bubbly on top.</li>
          <li>Flip and cook the other side.</li>
          <li>Serve and enjoy!</li>
        </ol>

        <p className="mb-1">My favorite recipe:</p>
        <ol id="wd-your-favorite-recipe" className="list-decimal list-inside mb-4">
          <li>Boil 2 cups of rice.</li>
          <li>Saute vegetables with spices.</li>
          <li>Mix rice with vegetables and serve hot.</li>
        </ol>

        <h5 className="font-medium mt-4 mb-1">Unordered List Tag</h5>
        <p className="mb-1">My favorite books (in no particular order):</p>
        <ul id="wd-my-books" className="list-disc list-inside mb-4">
          <li>Dune</li>
          <li>Lord of the Rings</li>
          <li>Ender's Game</li>
          <li>Red Mars</li>
          <li>The Forever War</li>
        </ul>

        <p className="mb-1">Your favorite books (in no particular order):</p>
        <ul id="wd-your-books" className="list-disc list-inside">
          <li>Harry Potter</li>
          <li>The Hunger Games</li>
          <li>Pride and Prejudice</li>
        </ul>
      </div>

      {/* Table */}
            <div id="wd-tables">
        <h4>Table Tag</h4>
        <table border={1} width="100%">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Topic</th>
              <th>Date</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Q1</td>
              <td>HTML</td>
              <td>2/3/21</td>
              <td>85</td>
            </tr>
            <tr>
              <td>Q2</td>
              <td>CSS</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
              <td>Q3</td>
              <td>NodeJS</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
              <td>Q4</td>
              <td>NextJS</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
              <td>Q5</td>
              <td>Javascript</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
              <td>Q6</td>
              <td>Bootstrap</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
              <td>Q7</td>
              <td>MongoDB</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
              <td>Q8</td>
              <td>Git</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
              <td>Q9</td>
              <td>VSCode</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
              <td>Q10</td>
              <td>SQL</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Average</td>
              <td>90</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Images */}
      <div id="wd-images" className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Image Tag</h4>
        <p>Loading an image from the internet:</p>
        <img
          id="wd-starship"
          width="400px"
          src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
          alt="Starship"
          className="mb-4"
        />
        <p>Loading a local image:</p>
        <img
          id="wd-teslabot"
          src="/image.png"
          width="200px"
          height="300px"
          alt="Local"
        />
      </div>

      {/* Forms */}
      <div id="wd-forms" className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Form Elements</h4>
        <form id="wd-text-fields" className="space-y-3">
          <h5 className="font-medium">Text Fields</h5>
          <input type="text" placeholder="Username" className="border p-1 rounded w-full" />
          <input type="password" defaultValue="123@#$asd" className="border p-1 rounded w-full" />
          <input type="text" title="John" className="border p-1 rounded w-full" />
          <input type="text" defaultValue="Wonderland" placeholder="Doe" className="border p-1 rounded w-full" />

          <h5 className="font-medium">Text Area</h5>
          <textarea className="border p-2 rounded w-full" defaultValue="Lorem ipsum dolor sit amet..." />

          <h5 className="font-medium">Buttons</h5>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => alert("Life is Good!")}
          >
            Hello World!
          </button>

          <h5 className="font-medium mt-4">Other HTML Field Types</h5>

<div className="space-y-2">
  <div>
    <input
      type="email"
      placeholder="jdoe@somewhere.com"
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <input
      type="number"
      defaultValue={100000}
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <input
      type="range"
      defaultValue={4}
      max={5}
      className="w-full"
    />
  </div>

  <div>
    <label htmlFor="wd-text-fields-dob" className="block mb-1">
      Date of birth:
    </label>
    <input
      type="date"
      defaultValue="2000-01-21"
      id="wd-text-fields-dob"
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <input
      type="text"
      placeholder="hint"
      title="tooltip"
      value="COMEDY"
      readOnly
      className="border p-2 rounded w-full"
    />
  </div>

  <div className="flex gap-4 items-center">
    <label className="flex items-center gap-1">
      <input type="radio" name="NAME1" value="OPTION1" />
      Option 1
    </label>
    <label className="flex items-center gap-1">
      <input type="radio" name="NAME1" value="OPTION2" defaultChecked />
      Option 2
    </label>
  </div>
</div>

        </form>
        <h5 id="wd-radio-buttons">Radio buttons</h5>

<label>Favorite movie genre:</label><br />

<input type="radio" name="radio-genre" id="wd-radio-comedy"/>
<label htmlFor="wd-radio-comedy">Comedy</label><br />

<input type="radio" name="radio-genre" id="wd-radio-drama"/>
<label htmlFor="wd-radio-drama">Drama</label><br />

<input type="radio" name="radio-genre" id="wd-radio-scifi"/>
<label htmlFor="wd-radio-scifi">Science Fiction</label><br />
<input type="radio" name="radio-genre" id="wd-radio-fantasy"/>
<label htmlFor="wd-radio-fantasy">Fantasy</label>

<h5 id="wd-checkboxes">Checkboxes</h5>
<label>Favorite movie genre:</label><br/>

<input type="checkbox" name="check-genre" id="wd-chkbox-comedy"/>
<label htmlFor="wd-chkbox-comedy">Comedy</label><br/>

<input type="checkbox" name="check-genre" id="wd-chkbox-drama"/>
<label htmlFor="wd-chkbox-drama">Drama</label><br/>

<input type="checkbox" name="check-genre" id="wd-chkbox-scifi"/>
<label htmlFor="wd-chkbox-scifi">Science Fiction</label><br/>

<input type="checkbox" name="check-genre" id="wd-chkbox-fantasy"/>
<label htmlFor="wd-chkbox-fantasy">Fantasy</label><br/>

<select defaultValue="VAL2">
  <option value="VAL1">Value 1</option>
  <option value="VAL2">Value 2</option>
  <option value="VAL3">Value 3</option>
</select><br/>

{/* Multiple select */}
<select multiple defaultValue={["VAL1", "VAL3"]}>
  <option value="VAL1">Value 1</option>
  <option value="VAL2">Value 2</option>
  <option value="VAL3">Value 3</option>
</select><br/>

{/* Your movie genre dropdowns */}
<select defaultValue="SCIFI" id="wd-select-one-genre">
  <option value="COMEDY">Comedy</option>
  <option value="DRAMA">Drama</option>
  <option value="SCIFI">Science Fiction</option>
  <option value="FANTASY">Fantasy</option>
</select><br/>

<select multiple defaultValue={["COMEDY","SCIFI"]} id="wd-select-many-genre">
  <option value="COMEDY">Comedy</option>
  <option value="DRAMA">Drama</option>
  <option value="SCIFI">Science Fiction</option>
  <option value="FANTASY">Fantasy</option>
</select><br/>



      </div>
      <h4>Anchor tag</h4>
Please
<a href="https://www.lipsum.com" id="wd-lipsum"> click here </a>
to get dummy text<br/>
    </div>
  );
}
