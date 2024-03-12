export default [
    {
      name: "The Caws",
      capital: "Lootsnest",
      special:
        "Passive: Gain +1 gold per turn for each gold producing facility",
      desc: `A faction filled with crowlike mercenaries, gamblers and other scum. 
            Focussed on expanding their reach to earn more, nothing matters more than gold,`,
      color: "yellow",
      tags: [
        { name: "Aggressive", kind: "danger" },
        { name: "Gold oriented", kind: "warning" },
      ],
    },
    {
      name: "The Devils",
      capital: "Doofstown",
      special:
        "Passive: Gain +1 food per turn for each food producing facility",
      desc: `A faction filled with food loving squirrel like creatures.
They love nothing more than scavenging for food, and are quite proficient at it.`,
      color: "red",
      tags: [
        { name: "Passive", kind: "success" },
        { name: "Food oriented", kind: "success" },
      ],
    },
    {
      name: "The Whoolies",
      capital: "Nutford",
      special: "Passive: Gain +1 population for each city level up",
      desc: `A faction consisting of humanoid teddy bears, cute at a first glance, but deadly when approached without caution 
focussed on growth and mass attack strategies.`,
      color: "saddlebrown",
      tags: [
        { name: "Aggressive", kind: "danger" },
        { name: "Growth focussed", kind: "warning" },
      ],
    },
    {
      name: "The Crunchers",
      capital: "Reeneville",
      special:
        "Passive: Gain +1 wood per turn for every building located in a forest",
      desc: `This faction filled with beaverlike creatures loves only one thing, wood. They sometimes even forget to reproduce because
their eyes are only on the forests around them.`,
      color: "lime",
      tags: [
        { name: "Passive", kind: "success" },
        { name: "Wood oriented", kind: "warning" },
      ],
    },
    {
      name: "The Colonisers",
      capital: "New York",
      special:
        "Passive: Gain +1 attack and +1 health when fighting inside of your territory",
      desc: `Made to colonise everything and everything, these ant-like creatures grow quickly and are deadly.`,
      color: "black",
      tags: [
        { name: "Tactical", kind: "warning" },
        { name: "Aggressive", kind: "danger" },
      ],
    },
    {
      name: "The Denisens",
      capital: "Wertolve",
      special:
        "Passive: Watchtowers have +1 on every attacking roll",
      desc: `A faction settled out of a den of wolves, working together at all times to provide food, 
      care and shelter for each other `,
      color: "gray",
      tags: [
        { name: "Tactical", kind: "warning" },
        { name: "Combo", kind: "success" },
      ],
    },
    {
      name: "The Slithers",
      capital: "Caimans",
      special:
        "Passive: Gain 1+ stone per turn from all stone producing facilities",
      desc: `A faction that consists of poor sighted snakelike creatures that love to furrow into crevice's and are incredible capable of restructuring stone
      Creating pathways and tunnels makes for the cosiest of homes`,
      color: "turquoise",
      tags: [
        { name: "Stone oriented", kind: "warning" },
        { name: "Mobility focussed", kind: "success" },
      ],
    },
    {
      name: "The Literarians",
      capital: "Bibliovon",
      special:
        "Passive: Fisheries give +1 food per turn",
      desc: `A faction filled with young Bobcats. With a particular love for sleeping, fish and fighting`,
      color: "orchid",
      tags: [
        { name: "Aggressive", kind: "danger" },
        { name: "Food oriented", kind: "success" },
      ],
    },
            {
              name: "The Waterwaddlers",
              capital: "Hylia",
              special:
                "Passive: Able to use fish invested water as natural bridges",
              desc: `A faction consisting of otter like creatures that treat the water the same as land, as long as it’s shallow enough.
    focussed on movement and watermobility`,
              color: "lightblue",
              tags: [
                { name: "All-rounded", kind: "danger" },
                { name: "Mobility focussed", kind: "warning" },
              ],
            },
  ]