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
              name: "The Waterwaddlers",
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