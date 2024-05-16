<script lang="ts">
      import * as Table from "$lib/components/ui/table/index.js";
      export let items: { id: number; name: string; price: string; rise: string; image: string }[] = [];
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="hidden w-[100px] sm:table-cell">
        <span class="sr-only">Image</span>
      </Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Price</Table.Head>
      <Table.Head class="hidden md:table-cell">
        Rise
      </Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each items as item (item.id)}
      <Table.Row>
        <Table.Cell class="hidden sm:table-cell">
          <img
            alt={item.name}
            class="aspect-square rounded-md object-cover"
            height="64"
            src={item.image}
            width="64"
          />
        </Table.Cell>
        <Table.Cell class="font-medium">
          {item.name}
        </Table.Cell>
        <Table.Cell>
          {item.price}
        </Table.Cell>
        <Table.Cell>{item.rise}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>