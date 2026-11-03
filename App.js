
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';

const desserts = [
  { name: 'Classic Baklava', emoji: '🥮', points: 10 },
  { name: 'Pistachio Baklava', emoji: '💚', points: 10 },
  { name: 'Walnut Baklava', emoji: '🌰', points: 10 },
  { name: 'Sobiyet', emoji: '🍯', points: 15 },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [order, setOrder] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!started || gameOver) return;

    if (time <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      setTime(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, time, gameOver]);

  const serve = (dessert) => {
    const correct = dessert.name === desserts[(order - 1) % 4].name;

    if (correct) {
      setScore(s => s + dessert.points);
    } else {
      setScore(s => Math.max(0, s - 5));
    }

    setOrder(o => o + 1);
  };

  const restart = () => {
    setScore(0);
    setTime(60);
    setOrder(1);
    setGameOver(false);
    setStarted(true);
  };

  const card = {
    backgroundColor: '#FFF0D5',
    padding: 18,
    borderRadius: 18,
    marginVertical: 7,
    alignItems: 'center',
    width: '100%'
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>🍯</Text>
      <Text style={styles.title}>BAKLAVA RUSH</Text>
      <Text style={styles.subtitle}>A SWEET SHOP CHALLENGE</Text>

      {!started ? (
        <View style={styles.panel}>
          <Text style={styles.big}>🥮</Text>
          <Text style={styles.heading}>Welcome to Baklava Shop!</Text>
          <Text style={styles.description}>
            Serve delicious Turkish desserts
            and earn as many points as possible!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setStarted(true)}>
            <Text style={styles.buttonText}>START GAME</Text>
          </TouchableOpacity>
        </View>
      ) : gameOver ? (
        <View style={styles.panel}>
          <Text style={styles.big}>🏆</Text>
          <Text style={styles.heading}>GAME OVER!</Text>
          <Text style={styles.description}>Your Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={restart}>
            <Text style={styles.buttonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.game}>
          <View style={styles.stats}>
            <Text style={styles.stat}>⭐ {score} Points</Text>
            <Text style={styles.stat}>⏱️ {time}s</Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.heading}>Customer Order</Text>
            <Text style={styles.big}>
              {desserts[(order - 1) % 4].emoji}
            </Text>
            <Text style={styles.order}>
              {desserts[(order - 1) % 4].name}
            </Text>
            <Text style={styles.description}>
              Choose the correct dessert!
            </Text>
          </View>

          <Text style={styles.heading}>Choose a Dessert</Text>

          {desserts.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={card}
              onPress={() => serve(d)}>
              <Text style={styles.dessert}>
                {d.emoji} {d.name}
              </Text>
              <Text style={styles.points}>+{d.points} Points</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.description}>
            Correct: +10 / +15  |  Wrong: -5
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#542A19',
    alignItems: 'center',
    padding: 20,
    paddingTop: 45
  },
  logo: { fontSize: 48 },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFD27A'
  },
  subtitle: {
    color: '#FFF0D5',
    letterSpacing: 3,
    marginBottom: 25
  },
  panel: {
    backgroundColor: '#F9DDAA',
    borderRadius: 22,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  big: { fontSize: 65, margin: 12 },
  heading: {
    color: '#542A19',
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  description: {
    color: '#75452B',
    textAlign: 'center',
    marginVertical: 12
  },
  button: {
    backgroundColor: '#A85D25',
    padding: 17,
    borderRadius: 14,
    width: '100%',
    marginTop: 15
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18
  },
  game: { width: '100%', flex: 1 },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  stat: {
    color: '#FFD27A',
    fontSize: 19,
    fontWeight: 'bold'
  },
  order: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#542A19'
  },
  dessert: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#542A19'
  },
  points: { color: '#A85D25', marginTop: 5 }
});
