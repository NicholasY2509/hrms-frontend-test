const dagre = require("dagre");
const data = {
  "nodes": [
    {"id": "3","type": "positionNode","data": {"label": "ADM & FINANCE HEAD"}},
    {"id": "18","type": "positionNode","data": {"label": "BRANCH HEAD"}},
    {"id": "90","type": "positionNode","data": {"label": "COUNTER SALES"}},
    {"id": "61","type": "positionNode","data": {"label": "SALES SUPERVISOR"}},
    {"id": "83","type": "positionNode","data": {"label": "UNIT COLLECTOR"}},
    {"id": "29","type": "positionNode","data": {"label": "DRIVER"}},
    {"id": "102","type": "positionNode","data": {"label": "DEPT HEAD HCD"}},
    {"id": "52","type": "positionNode","data": {"label": "PDS MAN"}},
    {"id": "78","type": "positionNode","data": {"label": "TECHNICIAN PAINT"}},
    {"id": "86","type": "positionNode","data": {"label": "WORKSHOP HEAD BP"}},
    {"id": "76","type": "positionNode","data": {"label": "TECHNICIAN GR"}},
    {"id": "71","type": "positionNode","data": {"label": "SERVICE SUPERVISOR"}},
    {"id": "92","type": "positionNode","data": {"label": "SERVICE OPERATIONAL MANAGER"}},
    {"id": "50","type": "positionNode","data": {"label": "PARTMAN GR"}},
    {"id": "87","type": "positionNode","data": {"label": "WORKSHOP HEAD GR"}},
    {"id": "81","type": "positionNode","data": {"label": "TOOL KEEPER GR"}},
    {"id": "84","type": "positionNode","data": {"label": "VALET SERVICE"}},
    {"id": "45","type": "positionNode","data": {"label": "MARKETING SUPPORT"}},
    {"id": "69","type": "positionNode","data": {"label": "SERVICE COLLECTOR"}},
    {"id": "32","type": "positionNode","data": {"label": "FOREMAN BP"}},
    {"id": "75","type": "positionNode","data": {"label": "TECHNICIAN BODY"}},
    {"id": "66","type": "positionNode","data": {"label": "SERVICE ADVISOR BP ADM"}},
    {"id": "49","type": "positionNode","data": {"label": "PARTMAN BP"}},
    {"id": "82","type": "positionNode","data": {"label": "UNIT ADM"}},
    {"id": "67","type": "positionNode","data": {"label": "SERVICE ADVISOR GR"}},
    {"id": "30","type": "positionNode","data": {"label": "FINANCE COORDINATOR"}},
    {"id": "33","type": "positionNode","data": {"label": "FOREMAN GR"}},
    {"id": "59","type": "positionNode","data": {"label": "SALES EXECUTIVE"}},
    {"id": "77","type": "positionNode","data": {"label": "TECHNICIAN LEADER"}},
    {"id": "38","type": "positionNode","data": {"label": "IT"}},
    {"id": "17","type": "positionNode","data": {"label": "BP ADM"}},
    {"id": "63","type": "positionNode","data": {"label": "SECURITY COORDINATOR"}},
    {"id": "62","type": "positionNode","data": {"label": "SECURITY"}},
    {"id": "20","type": "positionNode","data": {"label": "CASHIER SERVICE"}},
    {"id": "21","type": "positionNode","data": {"label": "CASHIER UNIT"}},
    {"id": "8","type": "positionNode","data": {"label": "APPERANTICE TECHNICIAN PAINT"}},
    {"id": "6","type": "positionNode","data": {"label": "AFTER SALES INSTRUCTOR"}},
    {"id": "54","type": "positionNode","data": {"label": "PIC WARRANTY"}},
    {"id": "1","type": "positionNode","data": {"label": "ACCESORIS ADM"}},
    {"id": "26","type": "positionNode","data": {"label": "DANRU"}},
    {"id": "79","type": "positionNode","data": {"label": "TECHNICIAN THS"}},
    {"id": "7","type": "positionNode","data": {"label": "APPERANTICE TECHNICIAN BODY"}},
    {"id": "46","type": "positionNode","data": {"label": "MATERIAL WAREHOUSE KEEPER BP"}},
    {"id": "60","type": "positionNode","data": {"label": "DEALER INSTRUCTOR"}},
    {"id": "24","type": "positionNode","data": {"label": "CONTROLLER BP"}},
    {"id": "44","type": "positionNode","data": {"label": "MAINTENANCE"}},
    {"id": "73","type": "positionNode","data": {"label": "TAX ADM"}},
    {"id": "65","type": "positionNode","data": {"label": "SERVICE ADVISOR BP"}},
    {"id": "23","type": "positionNode","data": {"label": "CLEANING SERVICE"}},
    {"id": "72","type": "positionNode","data": {"label": "KOORDINATOR CLEANING SERVICE"}},
    {"id": "14","type": "positionNode","data": {"label": "BILLING UNIT ADM (BPKB)"}},
    {"id": "57","type": "positionNode","data": {"label": "QUALITY CONTROL PAINT"}},
    {"id": "51","type": "positionNode","data": {"label": "PDS ADM"}},
    {"id": "36","type": "positionNode","data": {"label": "GARDENER"}},
    {"id": "93","type": "positionNode","data": {"label": "SERVICE CONSULTANT SUPERVISOR"}},
    {"id": "40","type": "positionNode","data": {"label": "KAIZEN MAN GR"}},
    {"id": "11","type": "positionNode","data": {"label": "BILLING SERVICE BP"}},
    {"id": "53","type": "positionNode","data": {"label": "PIC BOOKING"}},
    {"id": "35","type": "positionNode","data": {"label": "GA COORNINATOR"}},
    {"id": "68","type": "positionNode","data": {"label": "SERVICE BP ADMIN"}},
    {"id": "13","type": "positionNode","data": {"label": "BILLING UNIT ADM"}},
    {"id": "64","type": "positionNode","data": {"label": "SERVICE ADM"}},
    {"id": "25","type": "positionNode","data": {"label": "CRC"}},
    {"id": "19","type": "positionNode","data": {"label": "CAR POLISH"}},
    {"id": "5","type": "positionNode","data": {"label": "ADM HR & GA"}},
    {"id": "12","type": "positionNode","data": {"label": "BILLING SERVICE GR"}},
    {"id": "9","type": "positionNode","data": {"label": "AR SERVICE ADM"}},
    {"id": "37","type": "positionNode","data": {"label": "HR & GA"}},
    {"id": "4","type": "positionNode","data": {"label": "ADM COORDINATOR"}},
    {"id": "47","type": "positionNode","data": {"label": "MRA"}},
    {"id": "10","type": "positionNode","data": {"label": "BILLING SERVICE"}},
    {"id": "88","type": "positionNode","data": {"label": "TECHINICIAN SPOORING"}},
    {"id": "2","type": "positionNode","data": {"label": "ADM"}},
    {"id": "91","type": "positionNode","data": {"label": "CREATIVE AGENT"}},
    {"id": "101","type": "positionNode","data": {"label": "VENDOR BP"}},
    {"id": "85","type": "positionNode","data": {"label": "VALET SERVICE BP"}},
    {"id": "89","type": "positionNode","data": {"label": "WASHINGMAN GR"}}
  ],
  "edges": [
    {"id": "edge_18_3", "source": "18", "target": "3"},
    {"id": "edge_61_90", "source": "61", "target": "90"},
    {"id": "edge_3_83", "source": "3", "target": "83"},
    {"id": "edge_102_29", "source": "102", "target": "29"},
    {"id": "edge_3_52", "source": "3", "target": "52"},
    {"id": "edge_18_61", "source": "18", "target": "61"},
    {"id": "edge_86_78", "source": "86", "target": "78"},
    {"id": "edge_71_76", "source": "71", "target": "76"},
    {"id": "edge_92_71", "source": "92", "target": "71"},
    {"id": "edge_87_50", "source": "87", "target": "50"},
    {"id": "edge_87_81", "source": "87", "target": "81"},
    {"id": "edge_87_84", "source": "87", "target": "84"},
    {"id": "edge_18_45", "source": "18", "target": "45"},
    {"id": "edge_3_69", "source": "3", "target": "69"},
    {"id": "edge_71_81", "source": "71", "target": "81"},
    {"id": "edge_86_32", "source": "86", "target": "32"},
    {"id": "edge_86_75", "source": "86", "target": "75"},
    {"id": "edge_86_66", "source": "86", "target": "66"},
    {"id": "edge_86_49", "source": "86", "target": "49"},
    {"id": "edge_3_82", "source": "3", "target": "82"},
    {"id": "edge_87_67", "source": "87", "target": "67"},
    {"id": "edge_3_30", "source": "3", "target": "30"},
    {"id": "edge_87_33", "source": "87", "target": "33"},
    {"id": "edge_18_92", "source": "18", "target": "92"},
    {"id": "edge_61_59", "source": "61", "target": "59"},
    {"id": "edge_87_77", "source": "87", "target": "77"},
    {"id": "edge_92_87", "source": "92", "target": "87"},
    {"id": "edge_3_38", "source": "3", "target": "38"},
    {"id": "edge_71_67", "source": "71", "target": "67"},
    {"id": "edge_3_17", "source": "3", "target": "17"},
    {"id": "edge_102_63", "source": "102", "target": "63"},
    {"id": "edge_92_86", "source": "92", "target": "86"},
    {"id": "edge_63_62", "source": "63", "target": "62"},
    {"id": "edge_3_20", "source": "3", "target": "20"},
    {"id": "edge_3_21", "source": "3", "target": "21"},
    {"id": "edge_86_8", "source": "86", "target": "8"},
    {"id": "edge_102_6", "source": "102", "target": "6"},
    {"id": "edge_71_33", "source": "71", "target": "33"},
    {"id": "edge_87_54", "source": "87", "target": "54"},
    {"id": "edge_3_1", "source": "3", "target": "1"},
    {"id": "edge_71_50", "source": "71", "target": "50"},
    {"id": "edge_63_26", "source": "63", "target": "26"},
    {"id": "edge_87_79", "source": "87", "target": "79"},
    {"id": "edge_18_18", "source": "18", "target": "18"},
    {"id": "edge_86_7", "source": "86", "target": "7"},
    {"id": "edge_86_46", "source": "86", "target": "46"},
    {"id": "edge_102_60", "source": "102", "target": "60"},
    {"id": "edge_86_24", "source": "86", "target": "24"},
    {"id": "edge_102_44", "source": "102", "target": "44"},
    {"id": "edge_3_73", "source": "3", "target": "73"},
    {"id": "edge_86_65", "source": "86", "target": "65"},
    {"id": "edge_72_23", "source": "72", "target": "23"},
    {"id": "edge_3_14", "source": "3", "target": "14"},
    {"id": "edge_86_57", "source": "86", "target": "57"},
    {"id": "edge_3_51", "source": "3", "target": "51"},
    {"id": "edge_72_36", "source": "72", "target": "36"},
    {"id": "edge_87_93", "source": "87", "target": "93"},
    {"id": "edge_87_76", "source": "87", "target": "76"},
    {"id": "edge_87_40", "source": "87", "target": "40"},
    {"id": "edge_3_11", "source": "3", "target": "11"},
    {"id": "edge_71_53", "source": "71", "target": "53"},
    {"id": "edge_102_35", "source": "102", "target": "35"},
    {"id": "edge_3_68", "source": "3", "target": "68"},
    {"id": "edge_3_13", "source": "3", "target": "13"},
    {"id": "edge_3_64", "source": "3", "target": "64"},
    {"id": "edge_18_25", "source": "18", "target": "25"},
    {"id": "edge_86_19", "source": "86", "target": "19"},
    {"id": "edge_102_5", "source": "102", "target": "5"},
    {"id": "edge_102_72", "source": "102", "target": "72"},
    {"id": "edge_3_12", "source": "3", "target": "12"},
    {"id": "edge_3_9", "source": "3", "target": "9"},
    {"id": "edge_102_37", "source": "102", "target": "37"},
    {"id": "edge_3_4", "source": "3", "target": "4"},
    {"id": "edge_87_47", "source": "87", "target": "47"},
    {"id": "edge_3_10", "source": "3", "target": "10"},
    {"id": "edge_86_47", "source": "86", "target": "47"},
    {"id": "edge_71_88", "source": "71", "target": "88"},
    {"id": "edge_87_88", "source": "87", "target": "88"},
    {"id": "edge_3_2", "source": "3", "target": "2"},
    {"id": "edge_18_91", "source": "18", "target": "91"},
    {"id": "edge_86_101", "source": "86", "target": "101"},
    {"id": "edge_18_102", "source": "18", "target": "102"},
    {"id": "edge_86_85", "source": "86", "target": "85"},
    {"id": "edge_71_89", "source": "71", "target": "89"},
    {"id": "edge_71_84", "source": "71", "target": "84"},
    {"id": "edge_87_89", "source": "87", "target": "89"}
  ]
};

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR"
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 250, height: 100 })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  try {
    dagre.layout(dagreGraph)
  } catch (e) {
    console.error("Layout failed:", e);
  }

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - 250 / 2,
        y: nodeWithPosition.y - 100 / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}

const res = getLayoutedElements(data.nodes, data.edges);
console.log("Nodes calculated:", res.nodes.length);
console.log("Sample node:", res.nodes[0].position);
