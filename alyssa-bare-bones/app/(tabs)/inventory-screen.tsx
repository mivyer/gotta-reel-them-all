// Reel Hunters - Inventory System
// Built with React Native + React Native Game Engine concepts
// This is a simplified but structured implementation focusing on UI + logic

import React, { useEffect, useState } from "react"; // Import React and useState hook for state management
import {
    FlatList, // Efficient scrolling list
    Image, // Styling system
    ImageSourcePropType,
    Modal, // Pop-up overlay
    StyleSheet, // Container component
    Text, // Display images (thumbnails)
    TextInput,
    TouchableOpacity, // Makes components clickable
    View
} from "react-native";

import * as Font from "expo-font";

import { useRouter } from "expo-router";


// -----------------------------
// TYPES
// -----------------------------

type BugReel = {
  id: string;
  name: string;
  thumbnail: ImageSourcePropType;
  videoUrl: string;
};

type InventorySlot = {
  reel: BugReel | null;
  frame: any;
};

// -----------------------------
// CONFIG
// -----------------------------
const INVENTORY_SIZE = 12; // total capacity

// Pre-drawn assets (replace with your real assets later)
const bugReelFrames = [
  require("../../assets/images/bugreel0.png"),
  require("../../assets/images/bugreel1.png"),
  require("../../assets/images/bugreel2.png"),
  require("../../assets/images/bugreel3.png")
];

const emptyReelFrames = [
  require("../../assets/images/empty-reel0.png"),
  require("../../assets/images/empty-reel1.png"),
  require("../../assets/images/empty-reel2.png"),
  require("../../assets/images/empty-reel3.png")
];

const NUM_BUGREEL_FRAMES = 4;
const NUM_EMPTY_FRAMES = 4;


// -----------------------------
// REEL DATA 
// -----------------------------

const initialBugReels = [
  // Each bug-reel represents a captured reel
  {
    id: "1", // Unique identifier
    name: "controlled ant",
    thumbnail: require("../../assets/images/thumbnail-placeholder.png"), // Placeholder thumbnail
    videoUrl: require("../../assets/reels/controlled_ant.mp4") // Video URL
  },
  {
    id: "2",
    name: "gambling dog",
    thumbnail: require("../../assets/images/thumbnail-placeholder.png"),
    videoUrl: require("../../assets/reels/gambling_dog.mp4")
  },
  {
    id: "3",
    name: "slomo hamster",
    thumbnail: require("../../assets/images/thumbnail-placeholder.png"),
    videoUrl: require("../../assets/reels/slomo_hamster.mp4")
  }
];

// -----------------------------
// MAIN COMPONENT
// -----------------------------

export default function InventoryScreen() {
  const router = useRouter();

  // State to store all ACTIVE bug-reels in inventory
 const [bugReels, setBugReels] = useState<BugReel[]>(initialBugReels);

  // State to track which reel is selected
  const [selectedReel, setSelectedReel] = useState<BugReel | null>(null);

  // State to control modal (aka pop-up) visibility
  const [modalMode, setModalMode] = useState<"actions" | "confirmRelease">("actions");
  const [modalVisible, setModalVisible] = useState(false);
  
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [reelToRename, setReelToRename] = useState<BugReel | null>(null);

  const reelCount = bugReels.length;

  const inventorySlots = Array.from(
    { length: INVENTORY_SIZE },
    (_, i) => bugReels[i] ?? null
  );

  // -----------------------------
  // HANDLERS
  // -----------------------------

  // When user clicks a bug-reel
  const handleSelectReel = (reel: BugReel | null) => {
    if (!reel) return; // ignore empty slots
    setSelectedReel(reel); // Save selected reel
    setModalVisible(true); // Open popup modal
  };

  // Release (remove) a reel from inventory
 const handleConfirmRelease = () => {
  if (!selectedReel) return;

  // remove from inventory 
  const updatedSaved = bugReels.filter(r => r.id !== selectedReel.id);
  setBugReels(updatedSaved);

  setModalVisible(false);
  setModalMode("actions");

  // navigate to release screen
  router.push({
    pathname: "/release-screen",
    params: { name: selectedReel.name }
  });
};

  // Rename reel
  const handleRenamePress = (reel: BugReel) => {
    if (!selectedReel) return;
    setReelToRename(reel);
    setRenameText(reel.name);
    setRenameVisible(true);
  };

  const handleConfirmRename = () => {
    if (!reelToRename) return;

    const updated = bugReels.map((r) =>
      r.id === reelToRename.id
        ? { ...r, name: renameText }
        : r
    );

    setBugReels(updated); // update inventory 
    const updatedSelected = updated.find(
    (r) => r.id === reelToRename.id);
  
    setSelectedReel(updatedSelected || null);
    
    setRenameVisible(false);
    setReelToRename(null);
  };

  // Watch reel (navigate or play video)
  const handleWatch = () => {
    if (!selectedReel) return;

    setModalVisible(false);
    setModalMode("actions");
  
    router.push({
      pathname: "/watch-screen",
      params: {
        name: selectedReel.name,
        video: JSON.stringify(selectedReel.videoUrl),
        },
      });
  }

    // TODO: Play video!
    



  // -----------------------------
  // RENDER EACH BUG-REEL ITEM
  // -----------------------------

const renderItem = ({ item }: { item: BugReel | null }) => {
  const isEmpty = item === null;

  return (
    <TouchableOpacity
      style={styles.slot}
      onPress={() => item && handleSelectReel(item)}
      disabled={!item}
    >
      <View style={styles.frameContainer}>

        {/* EMPTY SLOT */}
        {isEmpty ? (
          <Image
            source={
              emptyReelFrames[Math.floor(Math.random() * NUM_EMPTY_FRAMES)]
            }
            style={styles.frameImage}
            resizeMode="contain"
          />
        ) : (
          <>
            {/* FILLED SLOT FRAME */}
            <Image
              source = {bugReelFrames[Math.floor(Math.random() * NUM_BUGREEL_FRAMES)]}
              style={styles.frameImage}
              resizeMode="contain"
            />

            <Image
              source={item.thumbnail}
              style={styles.thumbnailOverlay}
              resizeMode="cover"
            />
          </>
        )}

      </View>

      {!isEmpty && (
        <Text style={styles.reelName}>{item.name}</Text>
      )}
    </TouchableOpacity>
  );
};

  // -----------------------------
  // MAIN UI
  // -----------------------------

  return (
    <View style={styles.container}>

     <View style={styles.headerContainer}>
        <View style={{ position: "relative" }}>
        <Text style={styles.outline}>Inventory</Text>
        <Text style={styles.title}>Inventory</Text>
        </View>
        <Text style={styles.capacity}>Inventory: {reelCount} / {INVENTORY_SIZE}</Text>
    </View>
   

      {/* Grid of bug-reels */}
      <FlatList
        data={inventorySlots} 
        extraData={bugReels}
        renderItem={renderItem}
        keyExtractor={(_, index) => `slot-${index}`}
        numColumns={2}
        style={{ flex: 1 }}
        />

      {/* POP-UP MODAL FOR BUG REEL INFO */}
      <Modal
        visible={modalVisible} // Controls visibility
        transparent={true} // Makes background dim
        // animationType="slide" // Slide animation
      >
        <View style={styles.modalContainer}> 
          <View style={styles.modalContent}>

            {/* Selected Reel Thumbnail */}
            {selectedReel && (
                <View>
                <Text style={{ textAlign: "center", fontSize: 30, fontFamily: "Dokdo"}}>
                    Your Bug Reel:</Text>

                <View style={styles.modalFrameContainer}>

                    {/* Wings / frame background */}
                    <Image
                    source={bugReelFrames[Math.floor(Math.random() * 4)]} // TODO: make constant rather than randomize each time...
                    style={styles.modalFrame}
                    resizeMode="contain"
                    />

                    {/* Reel thumbnail overlay */}
                    <Image
                    source={selectedReel.thumbnail}
                    style={styles.modalThumbnail}
                    resizeMode="cover"
                    />
                </View>

                <Text style={{ textAlign: "left", fontSize: 20, fontFamily: "Agdasima"}}>
                 Name: {selectedReel.name}
                 {"\n"}Other info about this reel???
                </Text>
                </View>
                )}
            

            {modalMode === "actions" && (
            <View style={styles.buttonRow}>
                <TouchableOpacity
                style={styles.greyButton}
                onPress={() => setModalMode("confirmRelease")}
                >
                <Text style={styles.buttonText}>Release</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.greyButton} onPress={handleWatch}>
                <Text style={styles.buttonText}>Watch</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.greyButton} onPress={() => handleRenamePress(selectedReel!)}>
                <Text style={styles.buttonText}>Rename</Text>
                </TouchableOpacity>

              

            </View>
            )}
        {modalMode === "confirmRelease" && ( // MAKE CONFIRMATION MROE FLASHY!???
        <View style={{ alignItems: "center", marginTop: 20 }}>
            
            <Text style={{textAlign: "center", fontSize: 18, marginBottom: 10 }}>
            Are you sure you want to release this bug reel?
            </Text> 

            <View style={{ flexDirection: "row", gap: 20 }}>

            {/* CANCEL */}
            <TouchableOpacity
                style={styles.greyButton}
                onPress={() => setModalMode("actions")}
            >
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            {/* CONFIRM */}
            <TouchableOpacity
                style={styles.blueButton}
                onPress={handleConfirmRelease}
            >
                <Text style={styles.buttonText}>Release</Text>
            </TouchableOpacity>

            </View>
            </View>
            )}

            <TouchableOpacity 
                style={styles.closeX}
                onPress={() => {setModalVisible(false); setModalMode("actions");}}
            >
                <Image
                source={require("../../assets/images/close-button.png")}
                style={styles.iconImage}
                />
            </TouchableOpacity>

          </View>
        </View>

      {/* POP-UP MODAL FOR BUG REEL RENAMING */}  
      </Modal>
      <Modal visible={renameVisible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.renameModalContent}>

          <Text style={{ marginBottom: 10, fontSize: 16 }}>
            Rename Reel
          </Text>

          <TextInput
            value={renameText}
            onChangeText={setRenameText}
            autoFocus
            style={{
              borderWidth: 1,
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8
            }}
          />
          <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.greyButton}
            onPress={() => setRenameVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.blueButton}
            onPress={handleConfirmRename}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
    </View>
  );
}

// -----------------------------
// STYLES
// -----------------------------
const SLOT_SIZE = 150; // forces all items to same size regardless of image differences

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill screen
    padding: 10, // Spacing
    backgroundColor: "#ffffff" // White background
  },
  headerContainer: {
    backgroundColor: "#9DEBFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center"
    },
  title: {
    fontSize: 60, // Large text
    fontWeight: "bold", // Bold font
    marginBottom: 10,
    fontFamily: "Dokdo",
    color: "black",
  },
  outline: {
    position: "absolute",
    fontSize: 65,
    fontFamily: "Dokdo",
    color: "white",
    left: -10,
    top: 0,
},
  capacity: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#444",
    fontFamily: "Dokdo"
},
  slot: {
    flex: 1,
    margin: 5,
    alignItems: "center"
  },
  frameContainer: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    justifyContent: "center",
    alignItems: "center"
  },
  frameImage: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  thumbnailOverlay: {
    width: 45, 
    height: 70,
    borderRadius: 3,
    backgroundColor: "black"
  },
reelName: {
  marginBottom: 10,
  fontSize: 20,
  fontWeight: "600",
  color: "black",
  textAlign: "center",
  fontFamily: "Agdasima"
},

  modalContainer: {
    flex: 1,
    justifyContent: "center", // Center modal vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "rgba(0,0,0,0.5)" // Dark overlay
  },
  modalContent: {
    paddingTop: 60,
    width: "55%",
    height: "80%",
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
  },
   renameModalContent: {
    paddingTop: 60,
    width: "30%",
    height: "50%",
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
  },
modalFrameContainer: {
  width: 250,
  height: 250,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20,
},

modalFrame: {
  position: "absolute",
  width: "100%",
  height: "100%",
  alignItems: "center"
},

modalThumbnail: {
  width: "35%",
  height: "50%",
  borderRadius: 10,
  backgroundColor: "black"
},
  greyButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    width: 90,
  },
    blueButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#9DEBFF",
    borderRadius: 8
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Agdasima",
    fontSize: 20
  },
  buttonRow: {
  flexDirection: "row",
  justifyContent: "center",
  gap: 20, 
  marginTop: 20,
},

iconButton: {
  width: 60,
  height: 60,
  justifyContent: "center",
  alignItems: "center",
},

iconImage: {
  width: 50,
  height: 50,
},

closeX: {
  position: "absolute",
  top: 20,
  right: 20,
  zIndex: 10,
},
});
