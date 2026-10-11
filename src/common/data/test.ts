
export const data = {
  elements: [
    {
      type: "node",
      id: 1,
      lat: 20.0,
      lon: 85.0,
    },

    {
      type: "node",
      id: 2,
      lat: 20.0,
      lon: 85.001,
    },

    {
      type: "node",
      id: 3,
      lat: 20.0,
      lon: 85.002,
    },

    {
      type: "node",
      id: 4,
      lat: 20.001,
      lon: 85.002,
    },

    {
      type: "node",
      id: 5,
      lat: 20.002,
      lon: 85.002,
    },

    {
      type: "node",
      id: 6,
      lat: 20.002,
      lon: 85.001,
    },

    {
      type: "node",
      id: 7,
      lat: 20.002,
      lon: 85.0,
    },

    {
      type: "node",
      id: 8,
      lat: 20.003,
      lon: 85.0,
    },

    // Dead-end node
    {
      type: "node",
      id: 9,
      lat: 20.001,
      lon: 85.0005,
    },

    // =========================
    // WAYS
    // =========================

    {
      type: "way",
      id: 101,
      nodes: [1, 2, 3],
      tags: {
        highway: "residential",
      },
    },

    {
      type: "way",
      id: 102,
      nodes: [3, 4, 5],
      tags: {
        highway: "residential",
      },
    },

    {
      type: "way",
      id: 103,
      nodes: [5, 6, 7],
      tags: {
        highway: "residential",
      },
    },

    {
      type: "way",
      id: 104,
      nodes: [7, 8],
      tags: {
        highway: "residential",
      },
    },

    {
      type: "way",
      id: 105,
      nodes: [1, 9],
      tags: {
        highway: "service",
      },
    },
  ],
}