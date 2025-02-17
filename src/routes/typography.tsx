import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/typography')({
  component: RouteComponent,
  pendingMs: 0,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit molestiae tempora, omnis aut nemo fugiat eveniet
        voluptas impedit culpa dolorum veniam exercitationem sunt, harum placeat. Consectetur perferendis eligendi
        soluta repellat!
        <br />
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim, mollitia optio quos ipsa deserunt pariatur ex
        asperiores rem molestiae obcaecati iusto voluptas quasi sed soluta possimus. Eveniet corrupti aut sit.
      </p>

      <p className="font-light">Light</p>
      <p className="font-normal">Normal</p>
      <p className="font-medium">Medium</p>
      <p className="font-semibold">Semibold</p>
      <p className="font-bold">Bold</p>
      <p className="font-extrabold">Extrabold</p>

      <p className="italic">Italic</p>
      <p className="font-light italic">Light italic</p>
      <p className="font-normal italic">Normal italic</p>
      <p className="font-medium italic">Medium italic</p>
      <p className="font-semibold italic">Semibold italic</p>
      <p className="font-bold italic">Bold italic</p>
      <p className="font-extrabold italic">Extrabold italic</p>
    </div>
  )
}
