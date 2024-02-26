import cv2
import numpy as np

# Load the image
image = cv2.imread('background.JPG')

# Set all blue values to 255
image[:, :, 0] = 255  # 0 corresponds to the blue channel

image[:, : ,1] = image[:, : ,1]/3
image[:, : ,2] = image[:, : ,1]/3
# Create a quadratic white gradient
rows, cols, _ = image.shape
y, x = np.ogrid[:rows, :cols]

# Create a quadratic mask
mask = (1 - (x - cols/2)**2/(3*(cols/2))**2) * (1 - (y - rows/2)**2/(rows/2)**2)
mask = (255 * mask).astype(np.uint8)

# Apply the mask to the image
image = cv2.merge([cv2.add(image[:, :, i], mask) for i in range(3)])

# Save the edited image
cv2.imwrite('edited_image_with_gradient.jpg', image)

def overlay_stars(image_path):
    # Read the image using cv2
    original_image = cv2.imread(image_path)

    # Get image dimensions
    rows, cols, _ = original_image.shape

    # Create a transparent overlay for the stars
    stars_overlay = np.zeros_like(original_image, dtype=np.uint8)

    # Define star properties
    star_color = (0, 255, 255)  # Yellow color in BGR format
    star_size = 5
    num_stars = 50

    # Generate random positions for the stars in the top third of the image
    star_positions = np.random.randint(0, cols, size=(num_stars, 2))
    star_positions[:, 1] = np.random.randint(0, rows // 3, size=num_stars)

    # Draw stars on the overlay
    for position in star_positions:
        cv2.drawMarker(stars_overlay, tuple(position), star_color, markerType=cv2.MARKER_STAR, markerSize=star_size)

    # Blend the stars overlay with the original image
    result_image = cv2.addWeighted(original_image, 1, stars_overlay, 0.5, 0)

    # Display the result or save it
    # Save the edited image
    cv2.imwrite('cropped_image.jpg', result_image[:-500,:,:])

# Example usage
overlay_stars("edited_image_with_gradient.jpg")
